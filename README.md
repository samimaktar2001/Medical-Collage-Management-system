# Medora medical college platform

A working **development implementation** of the supplied medical-college PRD. It includes Next.js/React portals, a NestJS API, persistent PostgreSQL data, scoped authorization and academic workflows. Medora is a proposed fictional identity, not a real accredited institution.

**R0/R1 are not production-complete.** Read [implementation status](docs/implementation-status.md) and [every PRD requirement](docs/requirements-traceability.md). No hospital, gateway, email or malware scanner is connected. Production startup deliberately fails closed. Use synthetic data only.

## Run locally

Prerequisite: Node.js 22.16 or newer supported Node 22 release, npm. No Docker is required for the embedded PostgreSQL development database.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Choose a synthetic identity on the sign-in page. Database state persists under `.data/postgres`; do not run two API processes against that directory. The API listens on loopback port 4000. Sign out to switch identities. This is development identity selection, not production authentication.

On this Windows machine, if the global npm shim is broken, use `& 'C:\Program Files\nodejs\npm.cmd'` instead of `npm`.

Optional external PostgreSQL: set `DATABASE_URL` before running; use a disposable **development** database. The SQL and `pg` adapter are included, but the network PostgreSQL deployment and load tests have not been exercised here. The default PGlite engine runs PostgreSQL in-process and is not a multi-user production server.

## Check the source

```sh
npm run typecheck
npm run lint
npm test
npm run contracts:check
npm run build
```

`npm test` compiles the API and runs domain and HTTP tests with disposable synthetic databases. Port 4100 must be free. HTTP tests start their own API and verify a restart. `.data/test-*` directories are preserved for investigation and ignored by Git.

`npm run test:e2e` is a browser test suite; install Chromium with `npx playwright install chromium` first. Browser E2E was not run in this environment after browser access was blocked. Do not confuse it with the passing API tests.

## Explore a complete workflow

1. Registrar: import or create an application, start verification, verify its synthetic allotment and eligibility.
2. Dean: review the verified application and approve it.
3. Registrar: confirm enrolment. Capacity is checked transactionally and retries reuse the same result.
4. Faculty: open a conducted session, explicitly mark all students and finalize the register.
5. Student: see only own records, submit learning evidence or a request.
6. Faculty: return or verify assigned logbook evidence; enter marks and lock the assessment.
7. Dean: moderate and publish. Students receive only their own published result.
8. Finance: issue invoices, record verified **offline** receipts, request refunds; dean approves, finance confirms completion.
9. Editor/publisher: draft, review and publish institutional content. Draft changes do not overwrite the public approved version.

## Source layout

- `apps/web/app`: responsive UI and server-rendered public pages.
- `apps/api/src`: authoritative validation, authorization, state transitions and transactions.
- `packages/database/migrations`: reviewed PostgreSQL DDL; migration checksums prevent silent edits.
- `packages/contracts`: generated OpenAPI creation schemas and TypeScript input types.
- `tests`: database invariants and real HTTP session/API tests.
- `infra`: optional development infrastructure; not a production deployment.
- `docs`: original specifications, traceability, operating instructions and release gaps.

No live deployment was performed. Institution branding, approval policies, provider contracts, production identity, backup verification and the outstanding implementation requirements must be completed before real-data use.
