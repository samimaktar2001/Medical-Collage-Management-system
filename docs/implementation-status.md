# Implementation status

## Current milestone

29 September update: selected public website option 1 has been implemented with institutional navigation, responsive menu, CMS-backed notices, public filters/archive views, expanded synthetic content and safe publication metadata. Final 35-test regression run and production compilation pass. Visual/browser acceptance is currently blocked by the browser policy on a stale error tab; see `website-implementation-evidence.md` and `../design-qa.md`. Public application forms, managed site settings and approved admission-cycle/seat publication are still unfinished. This is not full client-demo or production acceptance.

## Production Readiness Fixes (Post-Audit 29 Sept)
Following a comprehensive production-readiness audit, several foundational blockers have been resolved. The test suite has successfully passed (48/48 tests):
- **SEO & Web Visibility:** Changed `robots.txt` to allow crawlers for public pages. Injected Open Graph, Twitter Cards, canonical URLs, dynamic page descriptions, and `EducationalOrganization` JSON-LD schema into layouts.
- **Security & Validation:** Enforced `Content-Security-Policy` and HSTS headers. Rate limiter is now reverse-proxy aware (`trust proxy`, `X-Forwarded-For`). Patched an ILIKE wildcard SQL injection risk in search queries. Fixed TOCTOU (time-of-check to time-of-use) race condition in learning module actions.
- **Frontend & Integration:** Fixed idempotency keys so that retry actions preserve the initial generated `crypto.randomUUID()`. Replaced static `ACADEMIC YEAR 2026–27` and `Main campus` labels with dynamic data. Replaced hardcoded `['Anatomy', 'Physiology']` in form dropdowns with a robust dynamic lookup fetching from the `masters` table. Added `API_INTERNAL_URL` configuration for SSR container portability. Handled client-side JSON parsing errors gracefully.

Working development platform with persistent database-to-UI slices. Full R0/R1 production completion is **not achieved**. R2/R3, optional clinical build and AI remain disabled. See `requirements-traceability.md` for each requirement, including internal work not yet implemented.

## Working surfaces

- Development identities, backend-owned hashed opaque sessions, HttpOnly cookie, exact-origin/CSRF checks, revocation and per-request role lookup.
- Institution and relationship-scoped students, sessions, marks, invoices, files, support and learning records.
- Admission creation/import, clarification, verification, independent approval, transactional seat allocation and idempotent enrolment.
- Competencies, conflict-checked sessions, attendance drafts/finalization, independent corrections and provisional eligibility.
- Assessment entry, missing-state distinctions, lock, moderation, independent publication, frozen snapshots and revocation.
- Assigned-supervisor logbook review, return/resubmit and stale-version conflict.
- Scoped resources, assignments, deadline extensions, submissions and feedback.
- Student certificate/leave/appeal request decisions (not official fulfilment or changed marks).
- Invoice creation, unique offline receipts, balance-limited refunds and independent approval.
- CMS draft/review/publish/archive/revision; independent en/bn content with explicit English fallback. Public sitemap routes, approved-content search and enquiry ticket creation.
- Confidential committee tickets; quarantined owner-only uploads; frozen academic evidence manifests; audit and transactional outbox rows.

## Verification

All 30 domain/learning/HTTP tests passed in the final combined run. TypeScript, API contract drift checks and optimized frontend compilation passed. Lint has 0 errors and 14 explicit-`any` warnings. The npm advisory audit reported no known vulnerabilities at check time. Exact evidence and unrun checks are recorded in `uat.md`.

The initial sign-in and real-data dashboard were inspected in the in-app browser. Later browser reconnection was rejected by the browser URL policy; further interactive/viewport checks were not completed. Do not claim Playwright, WCAG, load, penetration, provider or disaster-recovery acceptance.

## External and institutional blockers

No real institution name/brand, role owners, seat/quota policies, cohort curricula, attendance formulas, fee/refund schedules, retention rules, approved bilingual content or UAT sign-offs were supplied. No production OIDC/MFA, gateway, mail, scanner, S3, HMIS, university or accounting credentials/contracts were supplied. Hosting infrastructure and operational owners are unassigned.

## Internal unfinished work

Production identity integration is not implemented; lack of credentials is not the only missing step. Other remaining work includes document versioning/scanner adapter, enrollment history and official certificates, withdrawal/custody, quota configuration, full structured assessment/revaluation flows, competency remediation, financial reconciliation and balanced accounting journal, durable worker delivery, policy/cohort snapshots, admin grant/delegation UI, complete typed action contracts, full campus-level authorization and production observability. The matrix distinguishes these from provider blockers.

## Next implementation steps

1. Complete production identity + person-based role grants and MFA with a local OIDC test provider; keep development login blocked in production.
2. Finish cohort-bound versioned policies, admissions checklists, enrolment history, official documents and withdrawal/custody slices.
3. Implement private object storage, trusted scan worker, document versioning and short-lived authorized downloads.
4. Complete provider adapter contracts, financial journal/reconciliation, outbox worker and retry/dead-letter operations.
5. Complete all remaining R1 requirements, then exercise disposable external PostgreSQL concurrency, browser E2E, accessibility, load and restore acceptance before staged UAT.
