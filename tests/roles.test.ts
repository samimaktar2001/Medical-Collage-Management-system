import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { Database } from '../apps/api/src/database';
import { Domain, DomainError, type Actor } from '../apps/api/src/domain';
import { Learning } from '../apps/api/src/learning';
import { seed } from '../apps/api/src/seed';

let db: Database, domain: Domain, learning: Learning;
const actors: Record<string, Actor> = {};
before(async () => {
  db = new Database('memory://');
  await db.migrate();
  await seed(db);
  domain = new Domain(db);
  learning = new Learning(domain);
  for (const row of (await db.query('SELECT * FROM users')).rows) actors[row.id] = row as Actor;
});
after(async () => db.close());

// Independent acceptance matrix: these are business role boundaries, not imported implementation constants.
const common = ['notices', 'tickets', 'documents'];
const allowed: Record<string, string[]> = {
  student: [
    ...common,
    'students',
    'sessions',
    'competencies',
    'assessments',
    'logbook',
    'invoices',
    'learning',
    'submissions',
    'requests',
  ],
  faculty: [
    ...common,
    'students',
    'sessions',
    'competencies',
    'assessments',
    'logbook',
    'corrections',
    'masters',
    'policies',
    'learning',
    'submissions',
  ],
  registrar: [
    ...common,
    'students',
    'applications',
    'sessions',
    'competencies',
    'masters',
    'policies',
    'seat-pools',
    'requests',
  ],
  finance: [...common, 'students', 'invoices', 'payments', 'refunds'],
  dean: [
    ...common,
    'students',
    'applications',
    'sessions',
    'competencies',
    'assessments',
    'logbook',
    'corrections',
    'invoices',
    'payments',
    'refunds',
    'masters',
    'policies',
    'evidence',
    'audit',
    'seat-pools',
    'learning',
    'submissions',
    'requests',
  ],
  admin: [
    ...common,
    'students',
    'applications',
    'sessions',
    'competencies',
    'assessments',
    'content',
    'masters',
    'policies',
    'evidence',
    'audit',
    'seat-pools',
  ],
  editor: [...common, 'content'],
  publisher: [...common, 'content'],
  committee: common,
  auditor: [...common, 'students', 'evidence', 'audit'],
};
const resources = [...new Set(Object.values(allowed).flat())];
for (const role of Object.keys(allowed)) {
  test(`${role}: all resource access boundaries and dashboard match responsibilities`, async () => {
    for (const resource of resources) {
      const service = ['learning', 'submissions', 'requests'].includes(resource)
        ? learning
        : domain;
      if (allowed[role].includes(resource)) {
        const result = await service.list(resource, actors[role]);
        assert.ok(Array.isArray(result.items), `${role}/${resource}`);
      } else {
        await assert.rejects(
          () => service.list(resource, actors[role]),
          (e: unknown) => e instanceof DomainError && e.status === 403,
          `${role}/${resource}`,
        );
      }
    }
    const dashboard = await domain.dashboard(actors[role]);
    assert.equal(dashboard.students === null, !allowed[role].includes('students'));
    assert.equal(dashboard.invoices === null, !allowed[role].includes('invoices'));
    assert.equal(dashboard.pending_logbook === null, !allowed[role].includes('logbook'));
    assert.ok(dashboard.notices.every((n) => n.audience === 'all' || n.audience === role));
  });
}

test('IT admin, auditor and publisher cannot bypass independent business makers', async () => {
  for (const [role, resource] of [
    ['admin', 'invoices'],
    ['admin', 'content'],
    ['admin', 'assessments'],
    ['auditor', 'applications'],
    ['publisher', 'content'],
    ['dean', 'applications'],
    ['finance', 'policies'],
  ]) {
    await assert.rejects(
      () => domain.create(resource, {}, actors[role]),
      (e: unknown) => e instanceof DomainError && e.status === 403,
    );
  }
});

test('confidential concerns are visible only to their requester and committee', async () => {
  const ticket = await domain.create(
    'tickets',
    {
      title: 'Synthetic confidential concern',
      description: 'Private synthetic committee test evidence',
      confidential: true,
      severity: 'High',
      due_date: '2026-12-01',
    },
    actors.student,
  );
  for (const role of Object.keys(allowed)) {
    if (['student', 'committee'].includes(role))
      assert.equal((await domain.detail('tickets', ticket.id, actors[role])).id, ticket.id);
    else
      await assert.rejects(
        () => domain.detail('tickets', ticket.id, actors[role]),
        (e: unknown) => e instanceof DomainError && e.status === 404,
      );
  }
  await assert.rejects(
    () => domain.detail('tickets', ticket.id, actors.student2),
    (e: unknown) => e instanceof DomainError && e.status === 404,
  );
});

test('dashboard must surface database failure instead of silently hiding business counts', async () => {
  const broken = new Domain(db);
  broken.list = async (resource) => {
    if (resource === 'students') throw new Error('database unavailable');
    return { items: [], total: 0, page: 1, limit: 20 };
  };
  await assert.rejects(() => broken.dashboard(actors.student), /database unavailable/);
});
