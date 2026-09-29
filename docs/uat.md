# Verification and UAT

Institutional UAT approval: **not obtained**. This file records engineering evidence only.

Automated suites:

- `tests/domain.test.ts`: 21 SQL-backed domain tests, including student/tenant isolation, assignment, final-seat contention, duplicate enrolment/payment, refund bounds, locked attendance/correction, explicit mark states, independent publication, logbook stale reviews, confidential ticket access, quarantine, public draft isolation and frozen evidence.
- `tests/learning.test.ts`: 2 tests for assignment/submission scope, deadlines, feedback and request/appeal authorization.
- `tests/http.test.ts`: 7 real HTTP tests against a spawned API with its own disk-backed database, covering cookies, spoofed headers, CSRF/origin, safe error envelopes, row-wise import, blocked quarantine downloads, logout and restart persistence.
- `tests/e2e/workspace.spec.ts`: browser regression scenarios supplied but not executed after browser policy blocked access.

The assignment suite initially found an incorrect Date-to-string comparison. The implementation now compares ISO calendar dates. The initial HTTP harness used too short a readiness window for disk initialization; it now waits for actual health within a bounded deadline. The affected 9 tests subsequently passed.

An initial Next.js production build passed, including TypeScript and server-rendered institutional routes. Lint initially found unused imports; they were removed. Final command outputs and warning count are recorded below after the last combined run.

Manual browser evidence: development identity sign-in and database-derived overview observed. Later reconnect was blocked by browser URL policy, so no full desktop/mobile/keyboard walkthrough is claimed. External PostgreSQL concurrency, provider contracts, penetration tests, WCAG/screen reader audit, 500-user load, 5M-attendance benchmark, 10K import jobs, migration rehearsal and backup restore are unrun.

## Final verified commands — 28 September 2026

| Check | Result |
|---|---|
| `npm test` | 30 tests passed; 0 failed; 0 skipped (combined run about 7.9 seconds after compilation) |
| API + web TypeScript `--noEmit` | Passed |
| `eslint apps scripts tests` | 0 errors; 14 explicit-`any` warnings, retained as technical debt |
| `tsx scripts/contracts.ts --check` | Contracts match |
| API `tsc` compilation | Passed as part of `npm test` |
| `next build apps/web` | Passed; app, institution pages, sitemap and robots compiled |
| `npm audit --json` | 0 known vulnerabilities reported across all severity levels at check time |
| Browser E2E / Docker / GitHub-hosted CI | Not run; supplied configurations do not constitute execution evidence |

The CI workflow pins official checkout/setup-node revisions and performs locked install, typecheck, lint, contract check, tests, build and advisory audit. It has not been pushed to or executed on GitHub. A clean dependency advisory report is not a penetration test or compliance certification.
