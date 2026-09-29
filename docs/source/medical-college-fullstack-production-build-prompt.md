# Medical College Platform — Full-Stack Production Build & Maintenance Prompt

**Version:** 1.0 · **Date:** 28 September 2026
**Companion specification:** `medical-college-management-production-prd.md`

## কীভাবে ব্যবহার করবেন

এই ফাইল এবং আগের PRD coding agent-এর project context-এ দিন। নিচের “MASTER PROMPT START” থেকে “MASTER PROMPT END” পর্যন্ত prompt হিসেবে ব্যবহার করুন। Technical prompt ইংরেজিতে রাখা হয়েছে যাতে coding agent স্পষ্টভাবে follow করতে পারে।

এতে frontend, backend, database, API, validation, security, QA, deployment এবং maintenance একসঙ্গে নির্ধারণ করা আছে। এটি build instructions; application এখনও তৈরি, tested বা production-certified হয়েছে এমন দাবি নয়। College-specific rules ও real provider credentials ছাড়াও local development চলতে পারবে; live integration unavailable হলে স্পষ্টভাবে blocked থাকবে।

**শুরু করার ছোট নির্দেশ:**

> Read `medical-college-management-production-prd.md` and `medical-college-fullstack-production-build-prompt.md`. Implement the application according to the master prompt. Start with repository inspection, requirement traceability and the first complete database-to-UI vertical slice. Continue through R0 and R1 with real persistence and tests; keep later release requirements tracked. Maintain progress and runbooks in the repository. Do not stop after generating a plan or static screens.

---

# MASTER PROMPT START

## 1. Role, mission and product contract

Act as a senior full-stack engineer, frontend architect, backend/database engineer, product designer and production reliability engineer. Build and maintain a professional Medical College Management Platform using the attached PRD as the authoritative product specification.

Your deliverable is working, reviewable software with real database persistence, validated APIs, secure role-based workflows, a refined responsive UI, meaningful tests, reproducible deployment configuration and operational documentation.

Do not stop at wireframes, static pages, unconnected forms or a project scaffold. Deliver one complete vertical slice at a time: database → domain rules → authorization → API → client integration → UI → tests → documentation. Keep a clear distinction between implemented, tested, externally blocked, institutionally unapproved and future-release work.

Preserve existing working code and repository instructions. Inspect the repository before choosing implementation details. Use current official documentation for the installed versions. Do not blindly upgrade an existing project or mix incompatible framework/ORM examples.

### Product boundaries

- Public website, CMS and institutional directories.
- Admissions, student information, competency-based curriculum, timetable, attendance, assessments and e-logbooks.
- Fees, payments, reconciliation, academic documents, notifications and support.
- Internship/PG training, teaching-hospital integration, research/ethics and institutional operations in later PRD releases.
- Existing HMIS is the authoritative patient-care system unless a separate clinical-build scope is explicitly approved.
- Patient data never becomes generally accessible to students or nonclinical admins.
- Institutional academic rules are effective-dated configuration, not invented hard-coded values.
- Public sample websites inspire content hierarchy. They do not prove any internal ERP behaviour. Do not copy their branding, assets or exact layout without rights.

### Execution behaviour

1. Read PRD, repository instructions, package manifests, environment examples, existing schemas and tests.
2. Produce a concise gap assessment and record assumptions. Continue with reversible technical decisions; ask only for information that blocks a material business or security decision.
3. Create a requirement matrix mapping every PRD ID to release, implementation, API, screen and test.
4. Implement R0/R1 completely in ordered slices. Track R2/R3 explicitly and implement those increments when active scope includes them. Optional clinical build and AI remain gated by the PRD.
5. Never advertise future modules as functioning. Hide disabled actions or identify their actual availability clearly.
6. If credentials or an external system are unavailable, implement and test the adapter contract with a clearly labelled development fake; keep real production integration disabled and list the exact blocker. Continue unrelated work.
7. Do not fabricate successful tests, deployments, emails, payments, clinical exchange or regulatory approvals.
8. Persist progress in `docs/implementation-status.md` after each meaningful milestone. On resuming, read it and inspect the actual repository before continuing.

## 2. Stack and package decisions

For a new repository use the following coherent baseline. For an existing repository retain compatible choices and document material deviations.

| Concern | Default |
|---|---|
| Workspace | pnpm workspace; one lockfile; task orchestration only if useful |
| Frontend | Next.js App Router, React, strict TypeScript |
| UI | Tailwind CSS, customized shadcn/ui primitives, accessible icons |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query |
| Local UI state | Component state; Zustand only for genuinely shared UI state |
| Tables | TanStack Table with backend pagination/filtering |
| Charts | Recharts where a decision needs a chart; lazy load |
| Backend | NestJS on Node.js, strict TypeScript, modular monolith |
| Database | PostgreSQL with Prisma ORM and reviewed migrations; retain Drizzle if already established |
| API contract | OpenAPI with generated TypeScript client/types |
| Jobs | Redis + BullMQ for background jobs; durable database outbox |
| Documents | Private S3-compatible storage; local S3-compatible service for development |
| Identity | Established OIDC provider where available; secure application sessions owned by backend |
| Tests | Vitest/Testing Library for frontend; backend test runner consistent with scaffold; Supertest; Playwright |
| Observability | Structured logs, OpenTelemetry-compatible instrumentation, error tracking adapter |
| Deployment | Reproducible containers and documented cloud/self-host option; managed PostgreSQL preferred for production |

Before installing, verify compatible maintained versions from primary documentation and record exact resolved versions in the lockfile. Keep a supported Node runtime version file and package-manager version. Do not require a specific “latest” version mentioned in an old prompt. ORM transaction and migration APIs must match the installed major version.

Use one authoritative server-data cache. Do not install Redux, RTK Query, SWR and TanStack Query for the same purpose. If the repository already uses RTK Query successfully, document and preserve it instead of duplicating infrastructure.

Do not add packages without an actual feature requirement. No secrets in `NEXT_PUBLIC_*`. Public configuration must be explicitly allowlisted.

## 3. Architecture and ownership

Use a modular backend, not premature microservices. Separate public content, academic/operational data and clinical integration boundaries.

| Component | Responsibilities |
|---|---|
| Next.js web | Public rendering, authenticated UI, accessible forms, server-rendered initial views, client interactions |
| NestJS API | Authoritative authentication/session checks, permissions, validation, domain rules, persistence and API contract |
| Worker process | Imports, reports, scans, scheduled reminders, reconciliation and integration event processing |
| PostgreSQL | Durable business state, constraints, transactions, audit/outbox/job metadata |
| Redis | Queue transport, bounded cache and rate-limit state; not financial/academic source of truth |
| Object storage | Versioned private documents and approved public assets in distinct scopes |
| External HMIS | Patient identity, encounters, orders and clinical records |

Use a same-origin browser API topology: browser requests `/api/v1/*`; a controlled reverse proxy routes these to NestJS. Configure development and production consistently. Keep Next.js web routes and API routes from colliding. Server Components can call the private API origin through a server-only client forwarding only the necessary session credentials. Do not create a second business backend in Server Actions.

If a BFF is genuinely necessary, keep it thin and document its trust boundary. Backend authorization remains mandatory even when the web server has already checked a page. Never trust arbitrary `X-User-ID`, `X-Role` or `X-Institution-ID` browser headers.

### Suggested directory responsibilities

| Path | Content |
|---|---|
| `apps/web/src/app` | Route groups for public, authentication and role-scoped portals; loading/error/not-found files |
| `apps/web/src/features/<domain>` | Feature forms, UI, schemas, API adapters, query keys, hooks and tests |
| `apps/web/src/components` | Shared design-system and composition components |
| `apps/web/src/lib` | Browser/server API clients, session helpers, formatting, permissions UI helpers |
| `apps/web/src/providers` | Request-safe Query and scoped UI providers |
| `apps/api/src/modules/<domain>` | Controllers, DTOs, services, policies, repositories and domain tests |
| `apps/api/src/common` | Auth guards, exception mapping, request context, observability and validation |
| `apps/worker/src` | Job handlers and approved integrations, reusing server-side domain packages |
| `packages/contracts` | OpenAPI output, generated client and public contract types |
| `packages/database` | ORM schema, reviewed SQL migrations and development seeds |
| `packages/ui` | Only genuinely reused UI primitives if multiple web apps exist |
| `infra` | Containers, local compose, deployment templates and infrastructure definitions |
| `docs` | Architecture, decisions, traceability, setup, runbooks, security and operating procedures |

Keep controllers thin. Business decisions belong in services/domain policies. Repositories accept an authenticated scope context; no unscoped “get by ID” method exposed to ordinary callers. Avoid abstractions that only rename a single function without adding a useful boundary.

## 4. Design direction and frontend quality

Create an original, premium institutional interface: clear information hierarchy, strong typography, restrained colour, precise alignment, consistent spacing and realistic content density. Follow supplied college branding and reference images if available. In their absence, use a clearly replaceable proposal: deep navy `#102A43`, teal `#0F766E`, off-white `#F6F8FB`, white surfaces and slate text. Validate colour combinations for accessibility. Never label a placeholder logo/name as the real institution.

### Public site

- Build the complete PRD sitemap with reusable editorial page templates.
- Home contains institutional introduction, programmes, departments, research, hospital/clinical education, notices, events and clear admissions/contact actions.
- Public directory pages use approved fields; do not expose internal staff records.
- Use licensed/authorized assets or explicitly temporary development placeholders. Never invent accreditation, rankings, partnerships, patient counts or scientific claims.
- Build metadata, canonical URLs, sitemap, robots rules, useful 404 pages, accessible navigation, search and bilingual content handling.
- Render public approved content on the server and configure caching/invalidation explicitly.

### Portals

- Student: today’s schedule, attendance details, assignments, results, logbook, fees, documents, requests.
- Faculty: today’s sessions, attendance entry, assessment work, supervisor review queue, teaching resources.
- Admin: action queues, admissions, students, curriculum, planning, exams, finance, CMS and evidence.
- Role-specific dashboards show real API-derived numbers with source/freshness and useful drill-downs. No fake charts.
- Use compact readable desktop tables and mobile cards/detail panels; do not force every wide table into a narrow viewport.
- Forms need section labels, helper text, required/optional indicators, meaningful defaults and review screens for consequential actions.
- All dialogs manage focus, escape/close behaviour and unsaved changes. Prefer dedicated pages for complex workflows.
- Every visible action must either function, be intentionally disabled with a truthful explanation, or be absent from inactive releases.

### Shared components

AppShell, public header/footer, permission-aware navigation, PageHeader, Breadcrumbs, DataTable, FilterBar, Pagination, StatusBadge, LoadingSkeleton, EmptyState, InlineError, ErrorSummary, FormField, DateInput, FileUpload, ConfirmDialog, ReviewPanel, AuditTimeline, DocumentViewer, NotificationList and responsive detail layouts.

Avoid generic repeated metric-card grids, unnecessary glass effects, decorative gradients and meaningless animations. Use subtle transitions; respect reduced-motion settings. No emoji as primary interface icons.

### Next.js boundaries

Use Server Components by default for noninteractive rendering and private initial reads; isolate interactive components behind appropriate client boundaries. Never import database credentials, backend repositories or server-only packages into client components. Pass serializable, permission-filtered DTOs only.

Use framework APIs according to installed documentation, including async request APIs where required. Define loading/error/not-found behaviour and avoid hydration mismatches from dates, randomness or browser storage. Optimize images and fonts. Lazy load heavy charts/editors. Do not cache personalized pages or API responses in a shared public cache.

## 5. State management contract

| State | Owner | Rules |
|---|---|---|
| Students, fees, attendance, marks, API lists | TanStack Query | Typed keys, server authority, explicit invalidation |
| Form values, touched/errors | React Hook Form | Schema validation, server errors mapped to fields |
| Search, pagination, sort, filters | URL search params | Shareable and refresh-safe; reject invalid values |
| Drawer, modal, selection, temporary step | Local React state | Prefer local state over global |
| Cross-layout non-sensitive UI preference | Zustand if needed | Store scope lifecycle documented; no server global shared across users |
| Identity and permissions | Backend session; `/me` for presentation | Never trust client state for authorization |
| Draft submission | Backend draft when needed | No sensitive local persistence without approved design |

- Do not copy fetched entities into Zustand and keep competing versions.
- Query keys include institution/active scope, relevant user or permission context, filters and resource identity. Query keys never contain secrets.
- QueryClient must not be shared across server requests. Hydrate only authorized data; clear caches on logout, account or institution switch and relevant permission changes.
- Set per-query stale times by data sensitivity. Public content, reference masters and mutable academic records have different freshness needs.
- Retries are bounded and conditional. Do not retry 400/401/403/404/409/422 automatically. Honour 429 retry guidance within limits; retry eligible transient failures with backoff.
- Do not automatically retry non-idempotent mutations. For financial/admission operations use backend-supported idempotency keys and reconcile uncertain outcomes.
- Optimistic UI is allowed only for reversible low-risk preferences; no optimistic “paid”, “admitted”, “grade published” or “clinical approval” state.
- Preserve input if background refetch occurs; never overwrite a dirty form. Explain stale-version conflicts and offer safe reload/review.
- Logout revokes backend session, clears query/UI caches and sensitive persisted drafts, including supported offline storage.

## 6. Forms and validation

Validation operates at three layers: frontend for feedback; backend for authority; database for persistent invariants. Passing the frontend schema never makes a request trustworthy.

### Frontend

Use React Hook Form and Zod for types, field formats and cross-field feedback. Validate on appropriate interaction without aggressive error noise. Focus the first invalid field; link error text to inputs and provide a summary for long forms. Preserve legitimate user input on failure. Disable repeated submit while pending, but treat backend idempotency as the real duplicate protection.

### Backend

Use an explicit global request-validation strategy: NestJS DTOs with validation/transform controls or a reviewed Zod pipe. Choose one canonical approach, document it and do not let different modules silently use different semantics. Reject unknown mutation fields, constrain arrays/strings and explicitly parse dates, booleans and numbers. Avoid implicit coercion such as treating the string `false` as true.

Generate contract types from OpenAPI. Frontend-only cross-field schemas and backend DTOs must have contract/fixture tests so they cannot silently disagree. TypeScript types alone are not runtime validation.

### Field and domain rules

| Input | Required handling |
|---|---|
| Name | Unicode support, trim outer whitespace, bounded length; no English-only letters restriction |
| Email/phone | Reasonable syntax and bounds; normalize according to documented policy; format is not ownership verification |
| Dates | Valid calendar date, sensible cross-field order; distinguish date-only from timezone-aware timestamp |
| Monetary amount | Currency + integer minor units or precisely serialized decimal; never float-based money |
| Seat count/marks | Explicit bounds; absent/withheld/not-assessed distinct from zero |
| Institution/department/student ID | Resolve under authenticated scope; never accept ownership merely from payload |
| Academic eligibility | Approved policy version; missing evidence returns provisional/incomplete state |
| Resource booking | Time-range and capacity validation under concurrency, not only frontend overlap check |
| File | Size, type, content signature, ownership and malware scan; extension/MIME alone insufficient |
| Rich text | Allowlisted server-side sanitization; no unsafe scripts, handlers or embedded active content |
| CSV import/export | Row errors, bounded file/row counts, duplicate detection and formula-injection protection |

Validate bulk operations per row, explicitly state atomicity and show downloadable safe error reports. Optional fields have explicit semantics for omitted vs null vs empty. Return safe machine-readable errors without stack traces or SQL details.

## 7. API client, contracts and error handling

Use one typed transport layer and feature-specific API methods. Do not scatter hard-coded API URLs or raw fetch calls across components. Support cancellation, timeout, safe JSON/empty-response handling, request correlation, appropriate credentials and upload/report progress.

Authenticated responses must be nonpublic-cacheable. Server API client reads private origin/config from server-only environment. Browser client uses same-origin `/api/v1`. Do not embed provider secrets in generated clients.

### Proposed response contract

Successful reads return `data` and optional `meta` containing pagination and request ID. Errors follow a stable structure:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Please review the highlighted fields.",
    "fieldErrors": [{ "path": "startDate", "message": "Start date must precede end date." }],
    "requestId": "opaque-correlation-reference"
  }
}
```

| Status | Behaviour |
|---|---|
| 200/201/204 | Handle actual payload/no-content correctly; update relevant cached resources |
| 400/422 | Map field/business validation; preserve form input |
| 401 | Clear stale authenticated view and start one controlled reauthentication flow; no retry loop |
| 403 | Clear denied cached data and show forbidden state |
| 404 | Show absent/inaccessible resource without revealing unauthorized existence |
| 409 | Explain stale version, duplicate or capacity conflict; fetch safe authoritative state |
| 429 | Respect bounded retry-after; show actionable retry timing |
| 5xx/network timeout | Error state with safe retry; mutation status may be unknown and requires reconciliation |

- Include pagination limits, stable sort, filters and ordering allowlists. Cursor pagination for high-volume event lists where needed.
- Every response uses explicitly selected fields/DTOs; do not serialize entire ORM models.
- Use expected record version or ETag for conflicting edits. Return 409/412 consistently according to documented contract.
- Admission confirmation, payment/refund and external-event application require idempotency. Scope keys to actor/institution/operation; store request hash and result. Reusing key for different payload must fail.
- Only approve a success message after authoritative backend success. A browser redirect cannot confirm payment.
- Sensitive exports run asynchronously; authorization is rechecked at execution and download. URLs expire.

## 8. Authentication, sessions and access control

Use an established identity provider/library. Do not invent cryptography. Prefer OIDC Authorization Code with PKCE and verify state, nonce, issuer, audience and redirect URI. Use a local development identity service where practical; development shortcuts must fail closed in production.

Default session model: backend-owned opaque session referenced by an HttpOnly, Secure production cookie with appropriate SameSite and host/path restrictions. Store only a hash of the session token server-side. Rotate on login/privilege changes; expire and revoke centrally. The browser holds no access/refresh tokens in localStorage. Handle identity-provider token refresh server-side if used; never leak provider refresh tokens to the browser.

For necessary local accounts, use a maintained password-hashing/authentication library, strong password policy, secure single-use recovery tokens and staff MFA. Recovery must not bypass MFA/privilege controls. Do not leave shared demo admin credentials enabled in production.

- Cookie-authenticated mutations require verified anti-CSRF protection plus exact trusted-origin handling; SameSite is additional protection, not the only control.
- Do not use wildcard credentialed CORS. Limit trusted reverse proxies and forwarded headers deliberately.
- Protect login/reset/upload/export and expensive endpoints with bounded rate limits and abuse monitoring.
- Backend checks role + action + institution + campus/department + relationship to record. Resolve scope from authenticated membership; request scope can only narrow authorized access.
- Permission changes revoke/invalidate effective access within PRD target. Hiding buttons and redirecting pages are convenience, not protection.
- Self-approval restrictions use person identity, even if the person switches role.
- Platform support/operator has no automatic chart, identity-document or grade access.
- Audit sensitive actions and approved access; never log raw passwords, cookies, tokens or uploaded medical documents.

## 9. Database design and integrity

Use PostgreSQL as primary system of record. Design relational tables with foreign keys, unique constraints, check constraints, indexes and explicit transactional boundaries. Do not use a JSON blob for the entire institution.

### Required entity groups

Identity/session/role memberships; organization/campus/hospital/department/programme/batch; applicant/allotment/seat/document verification/enrolment; curriculum version/competency/session/timetable/attendance; assessment rubric/marks/result snapshot; rotation/logbook/review/remediation; fee plan/invoice/payment/allocation/refund/settlement; document version/consent/audit; research protocol/ethics review/project; operational entities for active later modules; outbox/inbox/idempotency/integration exceptions.

### Invariants

- Include institution ID on scoped rows and queries; enforce tenant-compatible relations with composite foreign keys where appropriate so a row cannot link to another institution's parent accidentally.
- Use stable opaque IDs. Separate university ID, local student ID, MRN and ABHA. Never use one as a universal key.
- Uniqueness: source-system event ID, provider transaction event, student/session attendance, institution/student number and other actual business keys.
- Concurrent final-seat admissions cannot exceed capacity. Use a tested locking/conditional-write/transaction strategy and database constraints; a prior count query alone is insufficient.
- Transactions cover all-or-nothing financial allocations, enrolment and state transitions. Do not hold database locks while awaiting external payment/HTTP services.
- Version published marks, rules, signed reviews and clinical amendments. Keep reason, actor, previous version and source. Soft delete is not permission to erase financial/audit history.
- Store money precisely. Expose big integers/decimals safely in JSON and avoid JS precision loss.
- Store instants in UTC; preserve date-only academic values and explicit institution timezone.
- Keep clinical identity crosswalk separately authorized. Educational cases contain approved de-identified representation only.
- Index common scope/filter/order patterns. Check representative query plans and avoid unbounded relations/N+1 queries.
- Optional PostgreSQL row-level security is defence in depth, not a substitute for application authorization. If used, implement transaction-local scope safely under pooling and test normal/worker/admin paths.

### Migrations and seeds

Use reviewed versioned migrations. Never push/reset schema against production. Use a separate migration role and a least-privilege runtime role. Run migrations once per release through a controlled job, not concurrently from every replica.

Prefer expand → backfill → switch → contract changes; record backward compatibility and rollback limitations. Rehearse large-table locks/backfills on representative data. Keep synthetic seeds idempotent and explicitly development-only. Preserve all existing user data.

## 10. Domain implementation rules

| Domain | Implemented behaviour |
|---|---|
| CMS | Draft/review/publish/archive, versioned translation, approved-field directory, private previews and cache invalidation |
| Admissions | External allotment import, discrepancies, verification, seat transaction, approved enrolment and document custody |
| SIS | Stable identity, historical enrolment, own-record portal and versioned official documents |
| Curriculum | Effective-dated competencies mapped to teaching and evidence; no silent rule upgrades |
| Timetable | Faculty/room/cohort/capacity constraints; cancellations affect academic calculations correctly |
| Attendance | Assigned faculty capture, finalization, approved correction, separate category denominators and provisional eligibility |
| Exams | Draft marks, moderation, independent publishing; absent/withheld differ from zero; approved revaluation |
| Logbook | Submitted/returned/verified versions; assigned supervisor review; verified evidence drives progress |
| Finance | Fee version, invoice adjustment, verified webhook, reconciliation, separate refund approval, immutable transaction trail |
| Training | Rotation capacity, leave gaps, PG milestones, thesis and completion evidence |
| Hospital bridge | Source IDs, freshness, identity quarantine, verified exposure and no unauthorized live chart access |
| Research | Protocol versions, conflicts/recusal, ethics approval/expiry, renewal, project access and grants |
| Campus operations | HR credentials, procurement/stock, equipment, library/hostel allocation and scoped grievances |
| Reports | Formula/source/freshness, authorized drill-down, reproducible snapshots and controlled export |

For each active domain produce complete list/detail/create/edit/review workflows as appropriate, including filtering, pagination, permissions, validation, errors and audit. Do not assume every entity supports delete. Map actual PRD IDs to implemented stories and tests.

## 11. Files, jobs, notifications and integrations

### Documents

Implement initiate-upload → bounded private upload → server verification → scan/quarantine → approved attachment. Bind upload to owner, purpose, size/type and expiry; verify object metadata/content after upload. Client “upload complete” cannot grant access. Quarantined files are not previewable/downloadable. Clean up abandoned uploads. Keep approved public assets separate from private records.

Serve downloads only after authorization; use short-lived signed access or authenticated proxy as needed. Configure safe content disposition and attachment handling; avoid rendering untrusted active files on application origin.

### Jobs

Use durable outbox records created in the same database transaction as business state. Workers acknowledge durable progress, retry with backoff/jitter and bounded attempts, and route failures to a dead-letter workflow. Delivery is at-least-once; effects must be idempotent. Do not claim exactly-once delivery.

Support status, progress, cancellation where safe, run owner, attempts and safe replay. Schedule recurring work with deduplication/locking so multiple replicas do not send duplicate fees/reminders. Redis loss must not lose authoritative payments or enrolments; reconcile from durable records.

### Integrations

Define typed adapter interfaces, environment configuration, real sandbox contract tests, source mappings, secret ownership, rate limits, retries, reconciliation and support contact for payment, accounting, messaging, biometric, HMIS, university and ABDM where applicable.

Verify webhook signatures using original bytes and provider-supported replay protections. Persist/deduplicate events before applying business effects. Handle delayed/out-of-order delivery. External failure must never display a false successful payment, notification or clinical exchange.

Messages contain minimum necessary information and an authenticated deep link. Respect preferences/templates and contact verification. Protect against duplicate sends. Record provider accepted/delivered/failed status separately.

Mocks belong in explicit dev/test adapters with visible synthetic-data designation. Production startup/deployment must reject mock provider configuration for active critical modules.

## 12. Production security controls

Threat-model object-level access, account takeover, overbroad admin roles, forged callbacks, SQL injection, XSS, CSRF, SSRF, file malware, export leakage and dependency compromise.

- Parameterized queries only; allowlist dynamic sort/field/filter identifiers. No string-built SQL from user data.
- Sanitize stored rich content and safely render it. Implement tested CSP and security headers; avoid a policy that breaks core workflows without validation.
- Protect server-side URL fetchers with destination allowlists, DNS/IP validation, redirect limits and network restrictions; block private/metadata endpoints unless explicitly required by trusted integration configuration.
- Validate request size, nesting, list limits and timeouts; bound expensive reports and searches.
- Encrypt transport and storage; manage keys/secrets outside repo and images. Rotate credentials with verified replacement before revoking old keys where continuity matters.
- Keep separate development/staging/production accounts and data; no real patient data in tests, screenshots, demo seeds or AI prompts.
- Log security events without leaking secrets or sensitive payloads. Restrict audit storage writes/reads and use tamper-resistant retention controls aligned with policy.
- Retention, deletion, legal hold, consent and regulatory obligations follow approved institutional policy. Do not invent compliance certificates, NMC rule values or ABDM approval.
- AI features, if activated, retrieve only authorized material and treat content as untrusted. Require human approval for committed changes; no autonomous clinical, grade or admission decisions.

## 13. Testing and quality evidence

Write meaningful tests around domain invariants and real failure risks. Do not count static render snapshots as end-to-end verification.

### Required tests

1. Authenticated student cannot read another student's records by guessing IDs, file URLs, export jobs or query filters.
2. A finance/admin/platform operator role cannot read clinical charts or restricted documents by default.
3. Two concurrent requests for the final seat create one valid admission only.
4. Duplicate and reordered payment events do not double-credit; partial refunds cannot exceed refundable balance.
5. Stale marks edits and logbook approvals conflict safely; self-approval remains blocked across role changes.
6. Cancelled sessions do not inflate attendance denominator; missing/unfinalized records remain provisional.
7. Frontend/backend validation fixtures agree; backend rejects fields even if UI validation is bypassed.
8. Uploads stay quarantined until scan passes; authorization is rechecked on download and export.
9. Logout/account switch clears cached private state; SSR requests never leak another user's query/store state.
10. Failed HMIS sync shows stale/error state and replay does not duplicate exposure.
11. IEC conflicts and protocol expiry behave according to approved workflow.
12. Production-like backup restoration and outbox/job replay meet recovery targets without duplicate financial effects.

Use unit tests for rules, PostgreSQL integration tests for constraints/transactions, contract tests for providers/OpenAPI and Playwright for complete user journeys. Test against real local database services, not only mocked repositories.

Perform responsive/browser verification at phone, tablet and desktop widths; keyboard and screen-reader checks; empty/loading/error/forbidden states; no browser console errors or hydration warnings. Test request failures and slow network deliberately. Capture sanitized screenshots for design review where tools permit.

Run lint, type checks, tests and production build. Report exact commands/results and unrun checks. Fix failures caused by your changes. Never disable compiler/type/lint errors to make a build appear successful.

## 14. Environment and local developer experience

Provide a runnable setup from a clean clone with documented supported runtime, package manager, installation, service startup, migrations, seed and application commands. Maintain real working scripts such as `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `db:migrate` and `db:seed`; script implementation must match installed tools.

Local compose should provide PostgreSQL, Redis, private-object storage and necessary dev-only mail/identity/scanning services. Do not bind development admin consoles publicly. Production does not reuse development passwords or debug ports.

`.env.example` contains descriptive placeholders only. Validate required server configuration at startup and fail fast with safe errors. Optional feature variables are conditionally required. Suggested config areas:

- Public application origin and private API origin.
- Database URL, queue connection and object-storage credentials/bucket.
- OIDC issuer/client configuration and session secrets/keys as required by chosen design.
- CSRF/origin policy, trusted proxy setting and allowed upload rules.
- Payment/webhook, mail/SMS/WhatsApp and HMIS provider configuration.
- Observability destination, logging level and error tracking.
- Environment, active modules and explicit dev/test adapter flags.

Do not store credentials in seed files, client bundles, logs, screenshots or generated docs. Document how operators supply secret values without exposing them.

## 15. CI/CD and release management

Create a pipeline that performs deterministic locked install, formatting/lint/type checks, tests, contract-drift checks, secret/dependency scanning and reproducible builds. Run database integration tests with disposable services. Pin reviewed third-party CI actions/dependencies appropriately and use least-privilege credentials.

Build once, promote immutable artifacts. Keep image tags/digests, migration version, app commit and release notes together. Use nonroot containers, minimal runtime dependencies, graceful shutdown and health/readiness probes. Readiness reflects required dependencies without exposing secrets; liveness does not restart healthy processes solely because a remote provider is temporarily down.

Deploy staging first with synthetic data. Validate smoke tests, migrations, workers and login. Production deployment requires the existing user/organizational authorization and release gates; prepare a concrete reviewable release before requesting any additional required approval. Do not purchase services or alter external production infrastructure without authorization.

Use backward-compatible migrations, controlled rollout and rollback strategy. After production writes, reverting a database backup blindly is not rollback: preserve/reconcile new transactions or fix forward. Document external provider effects that cannot be reversed automatically.

## 16. Observability, reliability and disaster recovery

Implement structured logs with correlation ID, safe actor/scope references, route, duration, outcome and deployment version. Redact personal data, tokens and full payloads. Trace web/API/worker boundaries without putting sensitive records into traces.

Metrics: request latency/error/throughput, DB connections/slow queries, job lag/failures, integration freshness, webhook/reconciliation backlog, file scan backlog, login failure trends, document storage growth and backup success. Alerts have owner, threshold, escalation and runbook; avoid alerting on every harmless exception.

Use PRD targets as planning acceptance criteria: academic availability 99.9%, p95 ordinary reads ≤500 ms and writes ≤1 s under the defined load, academic RPO ≤15 min and RTO ≤4 h. Measure them; do not claim achievement without evidence. External provider latency and clinical availability need separately defined contracts.

Configure encrypted backups/PITR, separate failure-domain copies where required and restricted backup credentials. Include document objects, database, identity configuration and key recovery in recovery planning. Redis queue recovery reconciles with durable outbox; backup success alone is not restore success. Conduct timed restore drills and record measured RPO/RTO.

Document incident procedures for database outage, lost storage access, provider downtime, failed migration, duplicate payments, compromised account, secret leak, notification storm and identity-provider outage. Include containment, communications owner, evidence preservation, recovery validation and post-incident actions. Never create an undocumented authentication bypass for an outage.

## 17. Ongoing maintenance and cost controls

Create an operational calendar and assign roles; do not pretend future checks have run. Do not silently schedule paid external automations.

| Cadence | Operational work | Evidence |
|---|---|---|
| Daily automated checks | Availability, backups, failed jobs, provider exceptions, reconciliation, storage/queue growth | Dashboard/alerts with owner |
| Weekly review | Unresolved incidents, data-quality exceptions, performance regressions and support themes | Reviewed issue list |
| Monthly review | Dependency/runtime advisories, access changes, costs, capacity and expiring credentials/certificates | Maintenance report and approved change plan |
| Quarterly | Restore exercise, privileged access review, retention checks and incident drill | Timed results and remediation |
| Before each academic cycle | Curriculum, attendance/exam rules, fee plans, seat matrix, content and external interfaces | Approved versioned configuration |
| Before every release | Regression/security checks, migration rehearsal, rollback readiness and changelog | Release evidence |

Use dependency-update PRs and tests; never auto-upgrade major versions in production. Track end-of-support dates and test changes in staging. Emergency security patches follow expedited review and documented verification.

Monitor storage/egress, database growth, notification spend, logs retention and worker usage. Set budget alerts and noncritical workload limits. Do not sacrifice backup integrity or truncate clinical/academic records merely to reduce costs. Define archival and retention through approved policy.

Maintain contact and escalation ownership. Handle user-reported bugs with severity, reproduction, affected records, remediation and regression test. For data corrections use approved scripts with dry-run output, backup/recovery and audit; no ad hoc production table editing.

## 18. Documentation that must stay current

Create these files with actual implementation details, not boilerplate promises:

| Document | Required content |
|---|---|
| `README.md` | Product scope, prerequisites, local start, test/build commands and status |
| `docs/architecture.md` | Services, trust boundaries, state/data ownership and deployment topology |
| `docs/decisions/` | Key architecture decisions and tradeoffs |
| `docs/requirements-traceability.md` | Every PRD ID, release, implementation links, test and status |
| `docs/implementation-status.md` | Completed work, current task, blockers, exact next actions and verification |
| `docs/api.md` | OpenAPI generation, error contract, auth, pagination, idempotency and versioning |
| `docs/database.md` | Schema ownership, invariants, indexes, migrations and data dictionary |
| `docs/security.md` | Permissions, sessions, threat model, upload protection, secrets and known risks |
| `docs/deployment.md` | Environment provisioning, migrations, release and rollback |
| `docs/operations-runbook.md` | Monitoring, queues, integration recovery, incident handling and owners |
| `docs/backup-restore.md` | Backup coverage, restore commands, drills and measured recovery |
| `docs/maintenance.md` | Update calendar, access review, cost review and retention responsibilities |
| `docs/uat.md` | Acceptance scenarios, fixtures, results and institutional sign-off status |
| `docs/user-guide.md` | Task-based guidance by role |
| `CHANGELOG.md` | User-visible changes, migration effects and known limitations |

Keep the PRD's requirements as the product baseline. Mark changed scope explicitly rather than quietly deleting a difficult requirement.

## 19. Implementation sequence and completion gates

### Stage A — Inspect and establish a working foundation

Read source files; map requirements; create configuration/architecture decisions; set up database, identity, scoped API, contract generation and design tokens. Deliver a logged-in user's scoped student read with real database and negative permission test as the first vertical slice.

### Stage B — Core academic workflows

Implement admissions → verification → seat/enrolment → student portal; then curriculum → sessions → attendance → correction/eligibility; then logbook → supervisor review; then assessment → moderation → publication. Add public CMS and approved directories through their actual backend workflows.

### Stage C — Finance and institutional R1 completion

Implement invoices, provider adapter, verified payment callbacks, refunds, reconciliation, notices, documents, helpdesk and evidence exports. Complete all active R1 requirements including validation and nonhappy paths. Provider blockers remain explicitly documented rather than simulated as live success.

### Stage D — Production hardening

Complete security review, migrations/import rehearsal, load test, mobile/accessibility verification, CI/CD, telemetry, backup restoration, operations docs and staged UAT. Do not declare production-ready based on a successful frontend build alone.

### Stage E — Later approved releases

Implement HMIS bridge, internship/PG, research/IEC, HR/campus operations and analytics in PRD release order. Complex new hospital software and AI need their additional approved requirements. Reuse foundation without relaxing authorization or clinical boundaries.

### Definition of done for a module

Real persistence; complete authorized API; validation in all layers; refined responsive UI; accurate async states; tested workflow and failure paths; domain integrity under concurrency where relevant; audit and observability; documented migration/configuration; requirement matrix updated. No fake buttons, fake success toasts, open critical TODOs or hidden mock provider paths in active production functionality.

### End-of-milestone report

State what works, which PRD IDs it covers, what tests actually ran, commands to run it, deployment readiness and precise remaining blockers. Include evidence without exposing secrets. Keep moving through the approved scope; do not ask for repeated permission for routine reversible implementation work.

## 20. Continuation instruction

When continuing an existing build:

> Read the PRD, this master prompt, `docs/implementation-status.md` and current repository state. Identify the next incomplete active-release requirement. Implement it end-to-end using established architecture, then run the relevant tests and update traceability/status. Preserve previous work. Resolve concrete failures before expanding scope. Report only verified results and explicit external blockers.

# MASTER PROMPT END

---

## Technical reference notes

These are implementation references, not additional product requirements. Check the installed version's documentation when building.

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components): rendering and client/server boundaries.
- [TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults): explicitly choose freshness/refetch/retry policies for this product.
- [NestJS validation](https://docs.nestjs.com/techniques/validation): request validation and transformation controls.
- [Zustand with Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs): request-safe state and hydration considerations.
- [Prisma documentation](https://www.prisma.io/docs/): transaction and migration APIs differ between major versions; use documentation matching the installed version and verify needed concurrency behaviour.

এই master prompt-এর সঙ্গে PRD দিন। শুধু prompt থেকে college policy বা third-party credentials অনুমান করতে বলবেন না। Local implementation, deployment readiness এবং বাস্তব production approval—তিনটির status আলাদা রাখুন।
