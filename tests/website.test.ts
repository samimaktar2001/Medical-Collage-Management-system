import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { Database } from '../apps/api/src/database';
import { Domain, Actor, DomainError } from '../apps/api/src/domain';
import { seed } from '../apps/api/src/seed';
import { seedWebsite } from '../apps/api/src/website-seed';
let db: Database, domain: Domain;
const actors: Record<string, Actor> = {};
before(async () => {
  db = new Database('memory://');
  await db.migrate();
  await seed(db);
  domain = new Domain(db);
  for (const row of (await db.query('SELECT * FROM users')).rows) actors[row.id] = row as Actor;
});
after(async () => db.close());
test('website fixture upgrade preserves edited content and business rows, and is idempotent', async () => {
  await db.query(
    "UPDATE content SET body='Preserved institution copy',published_body='Preserved institution copy',version=2 WHERE slug='about'",
  );
  const before = (await db.query('SELECT id,version FROM students ORDER BY id')).rows;
  await seedWebsite(db);
  assert.equal((await domain.publicContent('about'))[0].body, 'Preserved institution copy');
  assert.ok((await domain.publicContent('programmes'))[0].body.length > 700);
  assert.equal((await domain.publicContent()).filter((p) => p.kind === 'Notice').length, 3);
  const count = (await db.query('SELECT count(*)::int AS n FROM content')).rows[0].n;
  await seedWebsite(db);
  await db.migrate();
  assert.equal((await db.query('SELECT count(*)::int AS n FROM content')).rows[0].n, count);
  assert.deepEqual((await db.query('SELECT id,version FROM students ORDER BY id')).rows, before);
});
test('notice metadata is published independently; draft revisions cannot leak', async () => {
  const row = await domain.create(
    'content',
    {
      slug: 'notice-test',
      title: 'Verified notice',
      body: 'Published notice body',
      kind: 'Notice',
      language: 'en',
      review_date: '2026-12-31',
      category: 'Academic',
      issue_date: '2026-09-28',
      reference: 'TEST/01',
    },
    actors.editor,
  );
  assert.equal((await domain.publicContent('notice-test')).length, 0);
  const review = await domain.action(
    'content',
    row.id,
    'submit',
    { version: row.version },
    actors.editor,
  );
  const published = await domain.action(
    'content',
    row.id,
    'publish',
    { version: review.version },
    actors.publisher,
  );
  assert.equal((await domain.publicContent('notice-test'))[0].metadata.category, 'Academic');
  const draft = await domain.action(
    'content',
    row.id,
    'revise',
    { version: published.version },
    actors.editor,
  );
  await domain.action(
    'content',
    row.id,
    'edit',
    {
      version: draft.version,
      data: {
        title: 'Private title',
        body: 'Private draft',
        review_date: '2027-01-01',
        category: 'Recruitment',
        available_on: '2099-01-01',
      },
    },
    actors.editor,
  );
  const publicRow = (await domain.publicContent('notice-test'))[0];
  assert.equal(publicRow.title, 'Verified notice');
  assert.equal(publicRow.metadata.category, 'Academic');
  assert.equal(publicRow.body, 'Published notice body');
  assert.ok(String(publicRow.review_date).startsWith('2026-12-31'));
  assert.equal((await domain.publicContent(undefined, 'en', 'Private draft')).length, 0);
});
test('future notices are hidden, archived notices remain accessible, withdrawn notices disappear', async () => {
  await db.query("UPDATE content SET published_metadata=$1 WHERE slug='library-induction'", [
    JSON.stringify({ category: 'Student services', available_on: '2099-01-01' }),
  ]);
  assert.equal((await domain.publicContent('library-induction')).length, 0);
  await db.query("UPDATE content SET published_metadata=$1 WHERE slug='orientation-2026'", [
    JSON.stringify({ category: 'Academic', archive_on: '2020-01-01' }),
  ]);
  assert.equal((await domain.publicContent('orientation-2026'))[0].notice_state, 'Archived');
  const notice = (await db.query("SELECT * FROM content WHERE slug='orientation-2026'")).rows[0];
  await domain.action(
    'content',
    notice.id,
    'archive',
    { version: notice.version, reason: 'Withdraw inaccurate fixture' },
    actors.publisher,
  );
  assert.equal((await domain.publicContent('orientation-2026')).length, 0);
});
test('public publication uses IST date boundaries including the current date', async () => {
  const today = (await db.query("SELECT (now() AT TIME ZONE 'Asia/Kolkata')::date::text AS today"))
    .rows[0].today;
  await db.query("UPDATE content SET published_metadata=$1 WHERE slug='reporting-checklist'", [
    JSON.stringify({ available_on: today, archive_on: today }),
  ]);
  const notice = (await domain.publicContent('reporting-checklist'))[0];
  assert.ok(notice);
  assert.equal(notice.notice_state, 'Archived');
});
test('faculty cannot create public notices and unknown publication fields fail validation', async () => {
  const input = {
    slug: 'bad-notice',
    title: 'A notice',
    body: 'Some content',
    kind: 'Notice',
    language: 'en',
    review_date: '2026-12-31',
  };
  await assert.rejects(
    () =>
      domain.create(
        'content',
        { ...input, available_on: '2026-10-10', archive_on: '2026-10-01' },
        actors.editor,
      ),
    (e) => e instanceof DomainError && e.code === 'PUBLICATION_DATES',
  );
  await assert.rejects(
    () => domain.create('content', input, actors.faculty),
    (e) => e instanceof DomainError && e.status === 403,
  );
  await assert.rejects(
    () =>
      domain.create(
        'content',
        { ...input, published_metadata: { category: 'Academic' } },
        actors.editor,
      ),
    (e) => e instanceof DomainError && e.status === 422,
  );
});
