import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Database } from '../apps/api/src/database';
import { Domain, DomainError, Actor } from '../apps/api/src/domain';
import { seed } from '../apps/api/src/seed';
let db: Database, d: Domain;
const actors: Record<string, Actor> = {};
before(async () => {
  db = new Database('memory://');
  await db.migrate();
  await seed(db);
  d = new Domain(db);
  for (const user of (await db.query('SELECT * FROM users')).rows) actors[user.id] = user as Actor;
});
after(async () => db.close());
const rejected = (fn: () => Promise<unknown>, code: string) =>
  assert.rejects(fn, (error: unknown) => error instanceof DomainError && error.code === code);
test('student sees only their own record, even with guessed IDs and foreign institution IDs', async () => {
  const result = await d.list('students', actors.student);
  assert.equal(result.total, 1);
  assert.equal(result.items[0].id, 's01');
  await rejected(() => d.detail('students', 's02', actors.student), 'NOT_FOUND');
  await rejected(() => d.detail('students', 'outside-student', actors.admin), 'NOT_FOUND');
  assert.equal((await d.list('students', actors.outsider)).total, 1);
});
test('student invoices and session registers exclude other learners', async () => {
  const invoices = await d.list('invoices', actors.student);
  assert.ok(invoices.items.every((r) => r.student_id === 's01'));
  const session = await d.detail('sessions', 'ts01', actors.student);
  assert.equal(session.register.length, 1);
  assert.equal(session.register[0].id, 's01');
});
test('finance has no academic eligibility, clinical, or logbook access', async () => {
  await rejected(() => d.attendanceSummary(actors.finance, 's01'), 'FORBIDDEN');
  await rejected(() => d.list('logbook', actors.finance), 'FORBIDDEN');
  await rejected(() => d.list('clinical-charts', actors.admin), 'NOT_FOUND');
  const student = await d.detail('students', 's01', actors.finance);
  assert.equal(student.email, undefined);
});
test('faculty is limited to assigned sessions and department students', async () => {
  await rejected(() => d.detail('sessions', 'ts02', actors.faculty), 'NOT_FOUND');
  assert.equal((await d.list('students', actors.faculty2)).total, 0);
});
test('unknown mutation fields and invalid calendar dates are rejected', async () => {
  await rejected(
    () =>
      d.create(
        'tickets',
        {
          title: 'Test',
          description: 'Test body',
          severity: 'Normal',
          confidential: false,
          due_date: '2026-02-30',
        },
        actors.student,
      ),
    'VALIDATION',
  );
  await rejected(
    () =>
      d.create(
        'applications',
        {
          name: 'Candidate',
          email: 'a@example.test',
          external_ref: 'REF',
          pool_id: 'pool-mbbs',
          department: 'Anatomy',
          status: 'Enrolled',
        },
        actors.registrar,
      ),
    'VALIDATION',
  );
});
test('cross-institution relations cannot be attached to an invoice', async () => {
  await rejected(
    () =>
      d.create(
        'invoices',
        {
          student_id: 'outside-student',
          description: 'Test',
          amount_minor: 100,
          due_date: '2026-10-01',
          fee_version: 'test',
        },
        actors.finance,
      ),
    'RELATION',
  );
});
test('final-seat contention admits one candidate and retries do not create a second student', async () => {
  const pool = randomUUID();
  await db.query(
    'INSERT INTO seat_pools(id,institution_id,programme,batch,capacity) VALUES ($1,$2,$3,$4,1)',
    [pool, 'demo', 'MBBS', 'TEST-LAST-SEAT'],
  );
  const apps = [];
  for (let i = 0; i < 2; i++) {
    let row = await d.create(
      'applications',
      {
        name: `Last seat ${i}`,
        email: `last${i}@example.test`,
        external_ref: randomUUID(),
        pool_id: pool,
        department: 'Anatomy',
      },
      actors.registrar,
    );
    row = await d.action(
      'applications',
      row.id,
      'start-review',
      { version: row.version },
      actors.registrar,
    );
    row = await d.action(
      'applications',
      row.id,
      'verify',
      {
        version: row.version,
        data: { eligibility_verified: true, allotment_verified: true, payment_verified: true },
      },
      actors.registrar,
    );
    row = await d.action('applications', row.id, 'approve', { version: row.version }, actors.dean);
    apps.push(row);
  }
  const keys = [randomUUID(), randomUUID()];
  const result = await Promise.allSettled(
    apps.map((app, i) =>
      d.action(
        'applications',
        app.id,
        'enroll',
        { version: app.version },
        actors.registrar,
        keys[i],
      ),
    ),
  );
  assert.equal(result.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(
    Number(
      (await db.query('SELECT occupied FROM seat_pools WHERE id=$1', [pool])).rows[0].occupied,
    ),
    1,
  );
  const index = result.findIndex((r) => r.status === 'fulfilled');
  const retry = await d.action(
    'applications',
    apps[index].id,
    'enroll',
    { version: apps[index].version },
    actors.registrar,
    keys[index],
  );
  assert.equal(retry.status, 'Enrolled');
  assert.equal(
    Number(
      (await db.query("SELECT count(*) AS n FROM students WHERE batch='TEST-LAST-SEAT'")).rows[0].n,
    ),
    1,
  );
  await rejected(
    () =>
      d.action(
        'applications',
        apps[index].id,
        'enroll',
        { version: 999 },
        actors.registrar,
        keys[index],
      ),
    'IDEMPOTENCY_CONFLICT',
  );
});
test('verification and approval cannot be bypassed', async () => {
  await rejected(
    () => d.action('applications', 'a01', 'enroll', { version: 1 }, actors.registrar, randomUUID()),
    'ADMISSION_GUARD',
  );
  await rejected(
    () =>
      d.action(
        'applications',
        'a04',
        'approve',
        { version: 1 },
        { ...actors.registrar, role: 'dean' },
      ),
    'SELF_APPROVAL',
  );
});
test('clashing faculty, cohort or room time ranges are rejected', async () => {
  const session = await d.get('sessions', 'ts01', actors.faculty);
  await rejected(
    () =>
      d.create(
        'sessions',
        {
          title: 'Clash',
          department: 'Anatomy',
          cohort: '2026–27',
          faculty_id: 'faculty',
          competency_id: 'c02',
          room: 'Lecture hall A',
          category: 'Theory',
          starts_at: new Date(session.starts_at).toISOString(),
          ends_at: new Date(session.ends_at).toISOString(),
        },
        actors.faculty,
      ),
    'SCHEDULE_CLASH',
  );
});
test('finalized attendance locks; approved correction preserves audit; missing sessions stay provisional', async () => {
  const session = await d.detail('sessions', 'ts01', actors.faculty);
  const register = session.register.map((r: any) => ({ student_id: r.id, status: 'Present' }));
  const finalized = await d.action(
    'sessions',
    'ts01',
    'finalize',
    { version: session.version, data: register },
    actors.faculty,
  );
  await rejected(
    () =>
      d.action(
        'sessions',
        'ts01',
        'save-register',
        { version: finalized.version, data: register },
        actors.faculty,
      ),
    'LOCKED',
  );
  const correction = await d.create(
    'corrections',
    {
      session_id: 'ts01',
      student_id: 's01',
      proposed_status: 'Absent',
      reason: 'Verified register correction',
    },
    actors.faculty,
  );
  await rejected(
    () =>
      d.action(
        'corrections',
        correction.id,
        'approve',
        { version: 1, reason: 'Review' },
        { ...actors.faculty, role: 'dean' },
      ),
    'SELF_APPROVAL',
  );
  await d.action(
    'corrections',
    correction.id,
    'approve',
    { version: 1, reason: 'Source evidence verified' },
    actors.dean,
  );
  const summary = await d.attendanceSummary(actors.student);
  assert.equal(summary.categories[0].present, 0);
  assert.equal(summary.categories[0].total, 1);
  assert.equal(summary.categories[0].status, 'Provisional');
});
test('cancelled sessions do not enter attendance denominators', async () => {
  await d.action(
    'sessions',
    'ts04',
    'cancel',
    { version: 1, reason: 'Room unavailable' },
    actors.faculty,
  );
  const summary = await d.attendanceSummary(actors.student);
  assert.equal(summary.categories[0].total, 1);
});
test('stale reviews fail and wrong supervisors cannot review evidence', async () => {
  await rejected(
    () => d.action('logbook', 'l0', 'verify', { version: 1, reason: 'Checked' }, actors.faculty2),
    'NOT_FOUND',
  );
  const result = await d.action(
    'logbook',
    'l0',
    'verify',
    { version: 1, reason: 'Observed against competency rubric' },
    actors.faculty,
  );
  assert.equal(result.status, 'Verified');
  await rejected(
    () => d.action('logbook', 'l0', 'return', { version: 1, reason: 'Late edit' }, actors.faculty),
    'STALE_VERSION',
  );
});
test('return and resubmit preserves versions; obvious patient identifiers are rejected', async () => {
  await rejected(
    () =>
      d.create(
        'logbook',
        {
          competency_id: 'c02',
          supervisor_id: 'faculty',
          activity: 'Observation',
          activity_date: '2026-01-01',
          reflection: 'MRN: 12345',
          posting: 'Anatomy',
        },
        actors.student,
      ),
    'PATIENT_DATA',
  );
  const returned = await d.action(
    'logbook',
    'l1',
    'return',
    { version: 1, reason: 'Explain anatomical landmarks' },
    actors.faculty,
  );
  const result = await d.action(
    'logbook',
    'l1',
    'resubmit',
    {
      version: returned.version,
      data: { reflection: 'Identified the humeral head and epicondyles on a teaching model.' },
    },
    actors.student2,
  );
  assert.equal(result.version, 3);
  assert.equal(result.status, 'Submitted');
});
test('marks validate ranges and states, lock, independently moderate and publish only own results', async () => {
  const learners = (await d.list('students', actors.faculty, { limit: '100' })).items.filter(
    (s) => s.batch === '2026–27',
  );
  await rejected(
    () =>
      d.action(
        'assessments',
        'ex1',
        'save-marks',
        { version: 1, data: [{ student_id: 's01', state: 'Scored', score: 999 }] },
        actors.faculty,
      ),
    'MARKS',
  );
  const row = await d.action(
    'assessments',
    'ex1',
    'save-marks',
    {
      version: 1,
      data: learners.map((s, i) => ({
        student_id: s.id,
        state: i === 0 ? 'Absent' : 'Scored',
        score: i === 0 ? null : 40,
      })),
    },
    actors.faculty,
  );
  assert.equal((await d.list('assessments', actors.student)).total, 0);
  let next = await d.action(
    'assessments',
    'ex1',
    'submit',
    { version: row.version },
    actors.faculty,
  );
  next = await d.action(
    'assessments',
    'ex1',
    'moderate',
    { version: next.version, reason: 'Rubric and exceptional states checked' },
    actors.dean,
  );
  await rejected(
    () =>
      d.action(
        'assessments',
        'ex1',
        'publish',
        { version: next.version },
        { ...actors.faculty, role: 'dean' },
      ),
    'PUBLICATION',
  );
  next = await d.action('assessments', 'ex1', 'publish', { version: next.version }, actors.dean);
  const result = await d.detail('assessments', 'ex1', actors.student);
  assert.equal(result.marks.length, 1);
  assert.equal(result.marks[0].state, 'Absent');
  assert.equal(result.marks[0].score, null);
  assert.equal(result.snapshot, undefined);
  await d.action(
    'assessments',
    'ex1',
    'revoke',
    { version: next.version, reason: 'Correction review' },
    actors.dean,
  );
  assert.equal((await d.list('assessments', actors.student)).total, 0);
});
test('payment retries cannot double-credit and overpayment is rejected', async () => {
  const key = randomUUID(),
    payload = {
      version: 1,
      data: { amount_minor: 500000, reference: 'TEST-UNIQUE-PAYMENT', method: 'Bank transfer' },
    };
  const first = await d.action('invoices', 'inv0', 'record-payment', payload, actors.finance, key);
  const retry = await d.action('invoices', 'inv0', 'record-payment', payload, actors.finance, key);
  assert.equal(first.paid_minor, 500000);
  assert.equal(retry.paid_minor, 500000);
  assert.equal(
    (await db.query("SELECT * FROM payments WHERE reference='TEST-UNIQUE-PAYMENT'")).rows.length,
    1,
  );
  await rejected(
    () =>
      d.action(
        'invoices',
        'inv0',
        'record-payment',
        {
          version: first.version,
          data: { amount_minor: 999999999, reference: 'TOO-LARGE', method: 'Cash' },
        },
        actors.finance,
        randomUUID(),
      ),
    'OVERPAYMENT',
  );
});
test('refunds reserve balance, block self-approval and require completion', async () => {
  const payment = (await db.query("SELECT * FROM payments WHERE reference='TEST-UNIQUE-PAYMENT'"))
    .rows[0];
  const refund = await d.create(
    'refunds',
    { payment_id: payment.id, amount_minor: 300000, reason: 'Approved withdrawal fixture' },
    actors.finance,
  );
  await rejected(
    () =>
      d.create(
        'refunds',
        { payment_id: payment.id, amount_minor: 300000, reason: 'Too much' },
        actors.finance,
      ),
    'REFUND_BALANCE',
  );
  await rejected(
    () =>
      d.action(
        'refunds',
        refund.id,
        'approve-refund',
        { version: 1 },
        { ...actors.finance, role: 'dean' },
        randomUUID(),
      ),
    'SELF_APPROVAL',
  );
  const approved = await d.action(
    'refunds',
    refund.id,
    'approve-refund',
    { version: 1 },
    actors.dean,
    randomUUID(),
  );
  assert.equal(approved.status, 'Approved · awaiting completion');
  await d.action(
    'refunds',
    refund.id,
    'complete',
    { version: approved.version, reason: 'BANK-REFUND-1 verified' },
    actors.finance,
  );
  assert.equal((await d.get('invoices', 'inv0', actors.finance)).paid_minor, 200000);
});
test('confidential concerns are excluded from administrator search, detail and audit payloads', async () => {
  const ticket = await d.create(
    'tickets',
    {
      title: 'Confidential fixture',
      description: 'Private concern for designated committee',
      severity: 'High',
      confidential: true,
      due_date: '2026-10-01',
    },
    actors.student,
  );
  await rejected(() => d.detail('tickets', ticket.id, actors.admin), 'NOT_FOUND');
  assert.equal((await d.list('tickets', actors.admin, { q: 'Confidential fixture' })).total, 0);
  assert.equal(
    (await d.detail('tickets', ticket.id, actors.committee)).description,
    'Private concern for designated committee',
  );
  await d.action(
    'tickets',
    ticket.id,
    'resolve',
    { version: 1, reason: 'Handled privately' },
    actors.committee,
  );
  const audit = (
    await db.query("SELECT id FROM audit WHERE entity_id=$1 AND action='tickets.resolve'", [
      ticket.id,
    ])
  ).rows[0];
  assert.equal((await d.detail('audit', audit.id, actors.admin)).previous, undefined);
});
test('documents are quarantined and only owner metadata is readable', async () => {
  const doc = await d.create(
    'documents',
    {
      name: 'fixture.pdf',
      mime: 'application/pdf',
      content_base64: Buffer.from('%PDF-1.7\n synthetic').toString('base64'),
    },
    actors.student,
  );
  assert.equal(doc.status, 'Quarantined');
  assert.equal(doc.content_base64, undefined);
  assert.equal((await d.detail('documents', doc.id, actors.student)).content_base64, undefined);
  await rejected(() => d.detail('documents', doc.id, actors.student2), 'NOT_FOUND');
  await rejected(
    () =>
      d.create(
        'documents',
        {
          name: 'fake.pdf',
          mime: 'application/pdf',
          content_base64: Buffer.from('<script>bad</script>').toString('base64'),
        },
        actors.student,
      ),
    'FILE_SIGNATURE',
  );
});
test('public content excludes draft text; revision keeps previous approved version', async () => {
  let page = await d.create(
    'content',
    {
      slug: 'test-page',
      title: 'Draft title',
      body: 'Draft secret',
      kind: 'Page',
      language: 'en',
      review_date: '2026-12-31',
    },
    actors.editor,
  );
  assert.equal((await d.publicContent('test-page')).length, 0);
  page = await d.action('content', page.id, 'submit', { version: 1 }, actors.editor);
  page = await d.action('content', page.id, 'publish', { version: page.version }, actors.publisher);
  assert.equal((await d.publicContent('test-page'))[0].title, 'Draft title');
  page = await d.action('content', page.id, 'revise', { version: page.version }, actors.editor);
  await d.action(
    'content',
    page.id,
    'edit',
    {
      version: page.version,
      data: { title: 'Unapproved edit', body: 'Unapproved body', review_date: '2026-12-31' },
    },
    actors.editor,
  );
  assert.equal((await d.publicContent('test-page'))[0].title, 'Draft title');
});
test('evidence remains frozen after underlying data changes', async () => {
  const pack = await d.create(
    'evidence',
    { title: 'Test frozen pack', period: '2026' },
    actors.auditor,
  );
  const before = JSON.stringify(pack.manifest);
  await db.query("UPDATE students SET status='Withdrawn' WHERE id='s12'");
  const after = await d.detail('evidence', pack.id, actors.auditor);
  assert.equal(JSON.stringify(after.manifest), before);
  assert.equal(after.checksum, pack.checksum);
});
test('notices are scoped and policy approval cannot accept incomplete thresholds', async () => {
  assert.ok(
    (await d.list('notices', actors.finance)).items.every(
      (r) => r.audience === 'all' || r.audience === 'finance',
    ),
  );
  await rejected(
    () =>
      d.action(
        'policies',
        'pol1',
        'approve',
        { version: 1, reason: 'Invalid empty fixture' },
        actors.dean,
      ),
    'VALIDATION',
  );
});
