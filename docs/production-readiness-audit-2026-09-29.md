# Website and portal: local readiness audit

Date: 29 September 2026. Target: public website and staff/student portal launch together. Official domain and institution details will be supplied later; their absence did not stop local testing.

## Verdict

**Not ready for real-user production.** This is a functioning, substantially tested local development application with synthetic data. Public page reachability and role-scoped local modules are working. Several complete business journeys and production identity/operations are still missing. Passing a production *build* does not mean the backend can or should start in production: `apps/api/src/main.ts` explicitly blocks that startup.

This review examined the implementation, not just the requirements documents. It does not certify regulatory compliance, accessibility, penetration resistance or capacity. No real students or institutional data were used. No deployment was performed.

## Verified locally

| Check | Evidence/result | Limit |
|---|---|---|
| Existing domain, HTTP, learning and website suites | 35 tests passed before changes | Tests cover named scenarios, not every requirement |
| Expanded suite | **48 tests passed, 0 failures, 0 skipped** | Embedded PostgreSQL and isolated HTTP test database; not external PostgreSQL load acceptance |
| Role authorization | 10 roles × 22 resource boundaries; dashboard visibility, denied makers and confidential concerns | Single-role accounts; person-based multi-role grants still absent |
| Portal browser smoke | **92 role/section visits across all 10 roles**; loading finished and record/empty state appeared | Section loading is not full action lifecycle acceptance |
| Public route browser crawl | **27 discovered public routes**, no error headings or broken loaded images | Published synthetic routes only; external links/documents not certified |
| Responsive DOM checks | All 27 routes at **390 px and 768 px**: no document-level horizontal overflow | Not a full visual/screen-reader assessment |
| Student journey | Sign-in, own scoped sections, custom request type, dirty-form Escape protection, save, reload persistence, logout | Synthetic leave request retained locally |
| Public enquiry → portal | Empty-submit browser validation, valid synthetic enquiry receipt, same reference visible in registrar helpdesk | No actual mail delivery, secure applicant tracking or duplicate-submit reconciliation |
| Public notice filter | Keyboard selection and form submission persisted Admissions in URL and returned 1 matching current notice | Only current synthetic dataset |
| Mobile navigation | Open menu, all destinations visible, Escape closes | Tested in browser viewport override |
| Static verification | Production compilation/TypeScript pass; lint 0 errors, 14 existing explicit-any warnings; API contracts match | These do not replace runtime acceptance |

Machine-readable browser observations: `audit-2026-09-29/browser-checks.json`. Build/lint/dependency output is retained in the same directory. Browser checks ran through the connected in-app browser. The repository Playwright CLI suite was **not executed**; its obsolete native-select calls were updated and dropdown regressions added. Do not report that CLI suite as passing.

## Defects repaired during this audit

1. Custom dropdown pointer hover triggered automatic scrolling and could move an option under the pointer. Scrolling now follows keyboard navigation only and stays inside the menu. Exact identity selection was verified before all 10 role runs.
2. Multi-word keyboard typeahead treated spaces as immediate selection. Spaces now extend an active search; idle Space still opens/selects.
3. Native dialog Escape could bypass the unsaved-change confirmation by closing the dialog automatically. Default cancellation is prevented and the existing form close guard decides what happens.
4. Dialogs now have accessible names linked to their headings; resource tables have accessible names.
5. Three corrupted replacement characters introduced in dropdown labels were corrected.
6. Public error retry only reset the client boundary and could keep the failed server response. Retry now requests a fresh page. Removed the unsupported blanket assertion that no form had been submitted.
7. Enquiry success text is cleared before a new request, avoiding an old success being shown beside a new failure.
8. Dashboard errors were swallowed as if a role had no access. Only expected permission denials become hidden counts; database failures propagate. Regression test added.
9. Currency formatting now preserves paise instead of rounding every displayed amount to whole rupees.
10. Preview login and dashboards explain role responsibilities. Editor/publisher and auditor dashboards now offer their actual work directly.

## Roles: what is necessary

There are **10 role types and 12 sample identities**. Two faculty and two student identities demonstrate scoping; they are not four extra roles. Roles represent responsibilities, not a requirement to hire exactly ten people.

| Role | Purpose | Required for the combined scope? | Browser sections checked |
|---|---|---|---:|
| Student | Own academic records, fees, learning and requests | Yes | 12 |
| Faculty | Assigned teaching, attendance, marks and supervision | Yes | 13 |
| Registrar | Admissions verification, enrolment and student administration | Yes | 10 |
| Finance | Invoices, receipts and refund execution | Yes if finance is launched | 7 |
| Dean / academic approver | Independent academic, admission and refund approval | Yes; institution must nominate appropriate authority | 20 |
| IT administrator | Organization/configuration and operational support | Yes; not an unrestricted business approver | 13 |
| Website editor | Draft/revise public information | Yes for managed website | 4 |
| Website publisher | Independently approve public information | Yes under the supplied publishing requirements | 4 |
| Committee | Restricted confidential concerns | Yes if confidential grievance workflow is enabled | 3 |
| Auditor | Evidence and audit review | Assign only to authorized quality/audit staff | 6 |

Do not merge editor/publisher or maker/approver permissions simply to shorten the login menu. A real person may eventually hold multiple approved grants, but self-approval checks must use a stable **person identity**, not separate usernames. Current users have one `role` column: multi-role assignment, temporary delegation, expiry, access review and person-based separation remain implementation gaps. The preview identity selector must never become production authentication.

## Remaining material gaps

| Priority | Gap / concrete consequence | Implementation evidence | Required completion |
|---|---|---|---|
| **P0** | Real users cannot securely sign in or launch this API in production | `main.ts`: demo-login and explicit production startup refusal; migrations store a single user role | Trusted OIDC identity, MFA policy, account provisioning/revocation, stable person/grant model, session lifecycle tests; retain production block until gates pass |
| **P1** | Admissions page cannot run a real application cycle | `institution/components.tsx` AdmissionsPanel is static; forms page explains unconfigured workflows | Approved cycle/window and seat-source models, admin controls, versioned forms, authenticated draft/resume, uploads, acknowledgement/tracking, correction and decision history, server-side date enforcement |
| **P1** | Document uploads cannot complete a usable document journey | `main.ts` download refuses quarantine; `domain.ts` stores base64 | Private object storage, file versions, trusted scanner worker, authorized short-lived downloads, backup restoration and attachment publication controls |
| **P1** | Website editor cannot manage the whole institution site | `institution/layout.tsx`, navigation and AdmissionsPanel contain fixed identity/menus/statuses; CMS primarily text pages | Structured approved settings/header/footer/profile content, public notice attachments, corrigendum links, version history/rollback, owners and reviewed translations |
| **P1** | Student lifecycle stops before official completion | `learning.ts` request decision is not certificate issuance; no full progression/exit models | Enrolment history, transfer/withdrawal/readmission, clearance, revocable official documents, progression/attempt history and cohort rollover |
| **P1** | Academic workflows are partial | Generic sessions/assessments and textual rubrics in `domain.ts` | Cohort-bound policies, structured assessment components, full exam operations, revaluation/re-attempt, remediation and authorized final eligibility |
| **P1** | Financial workflow does not reconcile a live institution's books | Offline receipts/refunds exist; no settlement/closure ledger or gateway adapter | Approved fee plans, reconciliation, allocation, journal/export, period closing; verified/deduplicated provider callbacks if online payments enabled |
| **P1** | Notifications are recorded, not delivered | `domain.ts` inserts outbox rows; no delivery worker | Durable worker, provider adapters, retries/dead-letter handling, delivery status, support ownership and monitoring |
| **P1** | Production operation has not been demonstrated | Development launcher/compose; CI file unexecuted remotely; no restore evidence | Staging deployment, HTTPS/config/secrets, monitored DB/object backups and restore rehearsal, alerts, migration/rollback rehearsal, incident owners, representative load/security testing |
| **P2** | Committee scope is institution-wide, not specific committee membership | `domain.ts` ticket scope allows committee role all confidential tickets in institution | Explicit committee memberships, assignment/escalation/appeal boundaries and tests before sensitive real complaints |
| **P2** | Form dropdown sources cap at first 100 students and some fields use raw IDs | `domain.ts` options uses list limit 100; `resource-config.ts` has fixed departments/cohort and resource IDs | Authorized searchable/paginated reference pickers and managed academic master data; prevent inability to select later students |
| **P2** | Detail pages expose technical IDs and generic fields | `record-detail.tsx` generic key/value renderer | Role-specific summaries, human-readable related names, explicit workflow history, clear field errors and recovery |
| **P2** | Time-dependent fixtures and hardcoded academic year are not live configuration | `seed.ts`, `workspace.tsx`, admission/form copy | Institution-approved period/configuration and current content; do not fabricate facts |
| **P2** | Automated browser/accessibility coverage remains incomplete | Updated Playwright specs not run as a complete CLI suite; no screen-reader/load test | Dedicated test DB browser CI, every critical positive/negative journey, keyboard/zoom/contrast/screen-reader evaluation |
| **P2** | Release reproducibility/operational review absent | Workspace is not a Git repository; CI workflow supplied only | User-owned repository/release history, reviewed changes, immutable release artifacts and rollback procedure |

These are code/process gaps, not merely missing domain names or credentials. Institution content and provider credentials are separate later dependencies. Optional HMIS, payroll, library, hostel, research/IEC and other extended programmes must retain the source documents' applicability classification; their menus alone would not constitute implementation.

## Sequenced completion plan and gates

1. **Identity and permissions:** implement trusted identity and person-based grants, local test identity provider, revocation and same-person self-approval tests. Gate: all role and ownership negative cases pass with real authentication flow.
2. **Public website and applicant lifecycle:** structured CMS/settings, cycles/seats, versioned forms/documents and review tracking. Gate: exact nine-step client demonstration in source upgrade document works anonymously/applicant/editor/reviewer, including closed-window rejection.
3. **Academic and financial completeness:** complete agreed R1 lifecycle work, policies, official records and reconciliation. Gate: registrar/faculty/student/dean/finance golden journeys reconcile persisted records, history and audit.
4. **Reliable integrations/operations:** workers, scanner/storage, mail and payment adapters where applicable; restore/migration/load rehearsals. Gate: real failure/retry/recovery evidence, not mock success.
5. **Joint launch acceptance:** approved real college content, account owners, formal UAT, accessibility/security review and staging sign-off. Website and portal launch together only when both pass. Domain details can be supplied at this final stage.

## Local test records

Two clearly synthetic records were retained: student request `Synthetic local QA leave request`, and public enquiry `Public enquiry · Synthetic QA Visitor` (reference `ca68ee48-d736-42e8-8fe5-886bb540d003`). No external email was sent and no real educational or financial decision was made. Automated domain/HTTP tests use separate disposable test databases.
