import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, ChildProcess } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
const base = 'http://127.0.0.1:4100/api/v1',
  origin = 'http://localhost:3100';
let server: ChildProcess;
const dataDir = `.data/test-${randomUUID()}`;
async function start() {
  server = spawn(process.execPath, ['dist/api/main.js'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      API_PORT: '4100',
      APP_ORIGIN: origin,
      DATA_DIR: dataDir,
      DATABASE_URL: '',
      DEMO_MODE: 'true',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let last = '';
  server.stderr?.on('data', (b) => (last += String(b)));
  server.stdout?.on('data', (b) => (last += String(b)));
  for (let i = 0; i < 450; i++) {
    try {
      if ((await fetch(base + '/health')).ok) return;
    } catch {
      /* Server may still be initializing its development database. */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('API startup failed: ' + last);
}
before(async () => {
  mkdirSync('.data', { recursive: true });
  await start();
});
after(async () => {
  server.kill();
  await new Promise((r) => server.once('exit', r));
});
async function login(id: string) {
  const response = await fetch(base + '/auth/demo-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, 'X-Requested-With': 'medora' },
    body: JSON.stringify({ user_id: id }),
  });
  assert.equal(response.status, 201);
  const cookie = response.headers.get('set-cookie')!.split(';')[0];
  const me = await (await fetch(base + '/auth/me', { headers: { Cookie: cookie } })).json();
  return { cookie, csrf: me.csrf };
}
test('sessions are HttpOnly and spoofed role headers do not authorize access', async () => {
  const r = await fetch(base + '/auth/demo-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, 'X-Requested-With': 'medora' },
    body: JSON.stringify({ user_id: 'student' }),
  });
  assert.match(r.headers.get('set-cookie')!, /HttpOnly/i);
  const cookie = r.headers.get('set-cookie')!.split(';')[0];
  const denied = await fetch(base + '/students/s02', {
    headers: { Cookie: cookie, 'X-Role': 'admin', 'X-Institution-ID': 'demo' },
  });
  assert.equal(denied.status, 404);
  assert.equal((await fetch(base + '/students', { headers: { 'X-Role': 'admin' } })).status, 401);
});
test('cross-origin mutations and missing CSRF tokens are denied', async () => {
  const s = await login('student');
  const payload = JSON.stringify({
    title: 'Blocked',
    description: 'Must not persist',
    severity: 'Normal',
    confidential: false,
    due_date: '2026-12-01',
  });
  for (const headers of [
    { Origin: 'https://evil.example', 'X-CSRF-Token': s.csrf },
    { Origin: origin },
  ]) {
    const response = await fetch(base + '/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: s.cookie, ...headers },
      body: payload,
    });
    assert.equal(response.status, 403);
  }
});
test('API validation errors have safe envelopes and correlation IDs', async () => {
  const s = await login('registrar');
  const response = await fetch(base + '/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: s.cookie,
      Origin: origin,
      'X-CSRF-Token': s.csrf,
    },
    body: JSON.stringify({ name: 'incomplete' }),
  });
  assert.equal(response.status, 422);
  const data = await response.json();
  assert.equal(data.error.code, 'VALIDATION');
  assert.ok(data.error.correlation_id);
  assert.equal(data.stack, undefined);
});
test('allotment import reports independent row success, invalid rows and duplicate references', async () => {
  const s = await login('registrar'),
    row = {
      name: 'HTTP import candidate',
      email: 'import@example.test',
      external_ref: 'HTTP-' + randomUUID(),
      pool_id: 'pool-mbbs',
      department: 'Anatomy',
    };
  const response = await fetch(base + '/applications/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: s.cookie,
      Origin: origin,
      'X-CSRF-Token': s.csrf,
    },
    body: JSON.stringify({ source_batch: 'HTTP-TEST', rows: [row, { name: 'Invalid' }, row] }),
  });
  assert.equal(response.status, 201);
  const data = await response.json();
  assert.deepEqual(
    data.outcomes.map((o: any) => o.status),
    ['Imported', 'Rejected', 'Rejected'],
  );
});
test('quarantined file download is refused and other users cannot read metadata', async () => {
  const s = await login('student');
  const response = await fetch(base + '/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: s.cookie,
      Origin: origin,
      'X-CSRF-Token': s.csrf,
    },
    body: JSON.stringify({
      name: 'large-fixture.pdf',
      mime: 'application/pdf',
      content_base64: Buffer.from('%PDF-1.7\n' + 'x'.repeat(150000)).toString('base64'),
    }),
  });
  assert.equal(response.status, 201);
  const doc = await response.json();
  assert.equal(
    (await fetch(`${base}/documents/${doc.id}/download`, { headers: { Cookie: s.cookie } })).status,
    409,
  );
  const other = await login('student2');
  assert.equal(
    (await fetch(`${base}/documents/${doc.id}`, { headers: { Cookie: other.cookie } })).status,
    404,
  );
});
test('logout revokes session at the backend', async () => {
  const s = await login('student');
  const response = await fetch(base + '/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: s.cookie,
      Origin: origin,
      'X-CSRF-Token': s.csrf,
    },
    body: '{}',
  });
  assert.equal(response.status, 201);
  assert.equal((await fetch(base + '/auth/me', { headers: { Cookie: s.cookie } })).status, 401);
});
test('records survive a complete API process restart', async () => {
  const s = await login('student');
  const title = 'Persistence ' + randomUUID();
  const response = await fetch(base + '/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: s.cookie,
      Origin: origin,
      'X-CSRF-Token': s.csrf,
    },
    body: JSON.stringify({
      title,
      description: 'Disk persistence verification',
      severity: 'Normal',
      confidential: false,
      due_date: '2026-12-01',
    }),
  });
  assert.equal(response.status, 201);
  const saved = await response.json();
  server.kill();
  await new Promise((r) => server.once('exit', r));
  await start();
  const read = await fetch(`${base}/tickets/${saved.id}`, { headers: { Cookie: s.cookie } });
  assert.equal(read.status, 200);
  assert.equal((await read.json()).title, title);
});
