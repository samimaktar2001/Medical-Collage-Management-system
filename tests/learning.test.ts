import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { Database } from '../apps/api/src/database';
import { Domain, Actor, DomainError } from '../apps/api/src/domain';
import { Learning } from '../apps/api/src/learning';
import { seed } from '../apps/api/src/seed';
let db: Database, learning: Learning;
const people: Record<string, Actor> = {};
before(async () => {
  db = new Database('memory://');
  await db.migrate();
  await seed(db);
  learning = new Learning(new Domain(db));
  for (const row of (await db.query('SELECT * FROM users')).rows) people[row.id] = row as Actor;
});
after(async () => db.close());
test('assignments persist, reject late submissions and allow authorized feedback', async () => {
  const item = await learning.create(
    'learning',
    {
      title: 'Anatomy reflection',
      body: 'Describe landmarks on a teaching model.',
      cohort: '2026–27',
      department: 'Anatomy',
      kind: 'Assignment',
      due_date: '2099-01-01',
    },
    people.faculty,
  );
  const work = await learning.create(
    'submissions',
    { resource_id: item.id, body: 'A synthetic student response with no patient information.' },
    people.student,
  );
  assert.equal((await learning.list('submissions', people.student2)).total, 0);
  await assert.rejects(
    () => learning.detail('submissions', work.id, people.faculty2),
    (e) => e instanceof DomainError && e.code === 'NOT_FOUND',
  );
  const reviewed = await learning.action(
    'submissions',
    work.id,
    'review',
    { version: 1, reason: 'Good identification; explain orientation.' },
    people.faculty,
  );
  assert.equal(reviewed.status, 'Reviewed');
  const old = await learning.create(
    'learning',
    {
      title: 'Expired assignment',
      body: 'Do not accept late work',
      cohort: '2026–27',
      department: 'Anatomy',
      kind: 'Assignment',
      due_date: '2020-01-01',
    },
    people.faculty,
  );
  await assert.rejects(
    () =>
      learning.create('submissions', { resource_id: old.id, body: 'Late work' }, people.student),
    (e) => e instanceof DomainError && e.code === 'DEADLINE',
  );
});
test('student requests remain personal and academic appeals require dean decision', async () => {
  const request = await learning.create(
    'requests',
    {
      kind: 'Appeal',
      title: 'Review of formative assessment',
      reason: 'Request a review of the rubric interpretation.',
    },
    people.student,
  );
  await assert.rejects(
    () => learning.detail('requests', request.id, people.student2),
    (e) => e instanceof DomainError && e.code === 'NOT_FOUND',
  );
  await assert.rejects(
    () =>
      learning.action(
        'requests',
        request.id,
        'approve',
        { version: 1, reason: 'Review accepted' },
        people.registrar,
      ),
    (e) => e instanceof DomainError && e.code === 'FORBIDDEN',
  );
  const decided = await learning.action(
    'requests',
    request.id,
    'approve',
    { version: 1, reason: 'Approved for independent academic review; no marks changed.' },
    people.dean,
  );
  assert.equal(decided.status, 'Approved');
});
