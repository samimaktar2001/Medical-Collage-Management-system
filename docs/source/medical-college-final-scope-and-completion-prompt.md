# Medical College Management System — Final Scope & Completion Contract

**Version:** 1.0 · **Date:** 28 September 2026
**Purpose:** Final cross-functional requirements review and completion instructions for the existing application.

## 1. সরাসরি মূল্যায়ন

আগের PRD, full-stack master prompt এবং institutional website upgrade prompt মিলিয়ে একটি বিস্তৃত medical college management product-এর requirements আছে। কিন্তু application-এর code, database, integration ও test results এখানে পরিদর্শন করা হয়নি। তাই **requirements coverage বিস্তৃত** বলা যায়; **implemented application complete** বলা যায় না।

এই final document আগে সংক্ষেপে থাকা lifecycle/operational requirements বিস্তারিত করছে, missing acceptance criteria যোগ করছে এবং “complete” বলার measurable gate নির্ধারণ করছে। কোনো college-এর সব possible feature একইভাবে প্রযোজ্য নয়; agreed applicable scope-এর সব workflow বাস্তবে কাজ করাই completion।

### Documents and precedence

1. `medical-college-management-production-prd.md` — base functional requirements and existing requirement IDs.
2. `medical-college-fullstack-production-build-prompt.md` — engineering, security, testing and maintenance requirements.
3. `medical-college-institutional-website-upgrade-prompt.md` — public website/CMS/forms priorities and acceptance tests.
4. **This document** — final scope classification, additional requirements and release-completeness gates.

This document extends the others. It does not erase working features, reduce existing security requirements or assert that untested functionality works. Its additions have `COMP-*` identifiers and must be mapped into backlog, releases and tests.

## 2. What the product must cover

**C = Core:** required for the agreed medical-college management product, though delivery may span releases.
**A = Applicable:** required when the institution actually runs the service; otherwise record a reasoned exclusion.
**X = Separate programme:** complex specialist scope, not implied by a college ERP menu.

| ID | Product area | Complete workflow | Scope |
|---|---|---|---|
| SC-01 | Public institutional website | Identity → complete pages → approved publishing → search → notices/documents → archive | C |
| SC-02 | Admissions/counselling interface | Authoritative allotment/application → verification → fees/waiver → capacity check → enrolment | C |
| SC-03 | Configurable forms | Approved schema/window → applicant draft → submit/upload → review/correction → tracked outcome | C |
| SC-04 | Student records | Identity → enrolment history → corrections → transfer/withdrawal/readmission → completion/alumni | C |
| SC-05 | Curriculum/teaching | Programme/cohort policy → competencies → teaching plan → delivery → evidence | C |
| SC-06 | Timetable/resources | Faculty/cohort/room capacity → conflict check → publish → changes/cancellation | C |
| SC-07 | Attendance/eligibility | Capture → finalize → correction → category-wise calculation → provisional/final eligibility | C |
| SC-08 | Assessment/examination | Plan → eligibility → exam operations → marking/moderation → publication → appeal/re-attempt | C |
| SC-09 | Learning/e-logbook | Assignments/resources → submission → supervision → verified competency → remediation | C |
| SC-10 | Progression and graduation | Cohort/year rules → progression decision → pending obligations → clearances → award documents | C |
| SC-11 | Clinical education | Approved posting/exposure → supervisor verification → training completion | C for clinical programmes |
| SC-12 | Internship/PG | Rotation/duty → leave/makeup → thesis/portfolio → sign-offs → completion | A by programme |
| SC-13 | Finance | Fee plan → receivable → payment → settlement/refund → accounting reconciliation/closure | C |
| SC-14 | Staff/faculty | Appointment/credentials → allocation/workload → leave/substitution → appraisal/exit | C; full payroll A |
| SC-15 | Research/ethics | Project/protocol → conflict-aware review → conditions/amendments → renewal → closure | A; mandatory where institution conducts relevant work |
| SC-16 | Library/e-resources | Catalogue → member entitlement → issue/reserve/return → dues → clearance | A |
| SC-17 | Hostel/mess | Application → room allocation → occupancy/charges → transfer/checkout → clearance | A |
| SC-18 | Procurement/inventory | Request → approval → order → receipt/inspection → stock/use → invoice match | A |
| SC-19 | Assets/labs/facilities | Availability → booking/training checks → usage → calibration/maintenance → retirement | A |
| SC-20 | Welfare/grievances | Confidential intake → appropriate routing → review/escalation → outcome/appeal | C |
| SC-21 | Communications/support | Audience/consent → approved message → actual delivery state → helpdesk follow-up | C |
| SC-22 | Governance/disclosures | Evidence collection → validation/approval → period snapshot → export/publication → review | C with applicable disclosure configuration |
| SC-23 | Reporting/quality | Defined data source/formula → scoped reports → reconciliation → corrective actions | C |
| SC-24 | Identity/privacy/security | Membership → least privilege → access review → audit → retention/incident response | C |
| SC-25 | Operations/continuity | Release/migration → monitoring → backup/restore → incident recovery → maintenance | C |
| SC-26 | Hospital integration | Verified source identity → minimized exchange → teaching/reporting → reconciliation | A, core where agreed teaching-hospital integration is included |
| SC-27 | New clinical HMIS | Full patient-care workflows, clinical assurance and hospital operations | X |
| SC-28 | Transport, alumni, placements, events | Appropriate operational workflow where institution offers it | A |
| SC-29 | Mobile/offline/AI | Approved use case → security/quality evaluation → controlled release | A, not automatic completeness blockers |
| SC-30 | Multi-institution SaaS | Tenant provisioning/billing/isolation/offboarding for unrelated colleges | X unless separately commissioned |

A single-college system does not need a SaaS subscription engine to be complete. It does need scoped data access, safe backups and reliable institutional operations. A college ERP does not become a complete hospital EMR because an OPD menu exists.

## 3. What needed more detail in the previous specifications

These are specification gaps or expansions, not confirmed missing code. The implementation agent must inspect actual behaviour before deciding whether to build, repair or reuse.

| Gap | Earlier coverage | What is now explicit |
|---|---|---|
| Student progression | Academic progress and eligibility mentioned | Promotion/detention, remediation, repeat phase/year, supplementary attempts and full history |
| Examination operations | Assessments/moderation and OSCE described | Exam registration, admit cards, seating/invigilation, controlled papers, incident handling and release authority |
| Student exit | Certificates/alumni mentioned | Multi-office no-dues workflow, holds/waivers, revocable verification and withdrawal/readmission |
| Faculty workload | HR/rosters mentioned | Teaching allocation, leave substitution, delivered versus planned workload and handover |
| Financial closure | Invoices/payment/refunds described | Cash-counter close, allocation/unapplied payments, scholarships, concessions and controlled accounting close |
| Resource conflicts | Rooms/equipment covered separately | Unified scheduling and maintenance blackout across classroom/lab/skills/clinical resources |
| Academic rollover | Versions/master data described | Preview, controlled carry-forward, historical freeze and idempotent rollover |
| Exceptions and delegation | Approval engine described | Approval SLA, safe temporary delegation, escalation and separation of duties across roles |
| Institutional quality | Dashboards/evidence covered | Feedback cycles, corrective actions, evidence and closure |
| Support/offboarding | Runbooks/privacy described | Data export ownership, service exit, staff revocation, restore responsibility and practical handover |

## 4. Additional acceptance-ready requirements

### COMP-01 — Academic-year and cohort rollover

**Owner:** Registrar/academic coordinator. **Priority:** Core, required before the first live rollover.

Create the next academic period with a preview of programmes, curriculum assignments, fee plans, schedules and eligible progression. Copy only approved templates; do not copy attendance, marks, payment balances as new transactions or expired role grants blindly. Carry forward dues through the financial ledger and policy, not duplicate invoices.

**Acceptance:** dry-run report lists each effect; repeated execution cannot duplicate enrolments; an archived year remains queryable; old transcripts reproduce the old policy/results; conflicts stop affected records with actionable exceptions.

### COMP-02 — Promotion, detention and supplementary attempts

**Owner:** Examination office/academic authority. **Priority:** Core.

Represent exam attempt and academic enrolment separately. Support eligible promotion, conditional progression if permitted, remediation, repeat posting/phase/year, supplementary/reappear and withheld decisions using approved programme/cohort policy. Separate internal recommendations from university-authorized results.

**Acceptance:** a failed/repeated attempt does not overwrite history; incomplete evidence produces pending status; progression preview explains rule/data; authorized finalization is audited; learner sees approved next steps; subsequent policy changes do not silently change an old outcome.

### COMP-03 — End-to-end examination operations

**Owner:** Examination controller. **Priority:** Core within local institutional authority.

Add examination calendar, eligible candidate register, application/fee where authorized, admit card, seating plan, room capacity, invigilator allocation/substitution, attendance register, accommodations, incident records and controlled evaluation. For exams handled externally, provide approved import/export and status reconciliation rather than pretending to control the university exam.

Question bank/paper access must be restricted to explicit examination roles with timed release and audit; public CMS editors and ordinary admin users must not inherit exam-paper access. Handle examiner conflicts and authorized accommodations confidentially.

**Acceptance:** candidate/room/invigilator conflicts detected; ineligible/unverified candidates do not receive final admission to an exam inadvertently; confidential papers absent from public search/backups accessible to ordinary staff; results publication requires correct authority; candidate privacy respected in public notices.

### COMP-04 — Clearance, graduation and official documents

**Owner:** Registrar, finance, library, hostel and training offices. **Priority:** Core, office steps conditional.

Configure no-dues/clearance steps per programme. Track each office's approval, pending obligation, authorized waiver and appeal. Academic completion, financial status and clinical/internship completion are distinct checks with lawful institutional policy determining consequences; do not invent a universal payment-based withholding rule.

**Acceptance:** missing mandatory approval blocks the configured final action with explanation; waived obligations identify approver/reason; issued certificates have verification reference, version and revocation/reissue status; public verification exposes minimal authorized fields; offline copies remain identifiable.

### COMP-05 — Transfer, withdrawal, break and readmission

**Owner:** Registrar. **Priority:** Core where institutional policy permits.

Model name/identity corrections, programme/batch changes, external transfer, temporary academic break, permanent withdrawal and readmission. Track original-document custody, fees/refunds, university mapping, curriculum equivalence and outstanding obligations. Do not implement credit transfer indiscriminately across regulated programmes.

**Acceptance:** stable person ID and historical enrolment retained; withdrawn student's access adjusts without losing required records; duplicate readmission is prevented; any recognized prior competency/credit has explicit basis and approval.

### COMP-06 — Faculty workload, substitution and credentials

**Owner:** HOD/HR. **Priority:** Core.

Compare assigned and delivered teaching, practical, clinical supervision and assessment work. Leave affects scheduling through approved substitutes and notification. Credential/registration evidence has verification and expiry; record official designations, department affiliations and public-profile approval separately.

**Acceptance:** faculty/room collisions prevented; substitute can act only for assigned session/time; workload reports distinguish cancellation/reassignment; expired credentials trigger review without fabricated automatic regulatory conclusions; staff exit revokes access and reassigns open responsibilities.

### COMP-07 — Finance operations and period closure

**Owner:** Finance lead. **Priority:** Core; accounting/payroll integration as applicable.

Support approved fee schedules, instalments, scholarship sponsor/beneficiary mapping, concessions, late-fee policy, cash/bank/gateway payments, unapplied/partial allocations, settlement charges, refund accounting and daily cashier close. Receipts, credit adjustments and settlement records are different entities.

If a separate accounting system is authoritative, use reconciliation/export rather than a second inconsistent general ledger. Close financial periods with controlled adjustments and approvals. Payroll, stipends and statutory calculations use approved rules/provider scope.

**Acceptance:** opening balance + postings = closing balance; settlement net/gross differences are explained; duplicate callback cannot increase paid balance; maker cannot solely approve own refund; reopening a close is audited; reports reconcile to the source ledger.

### COMP-08 — Shared resource allocation

**Owner:** Academic/facility coordinator. **Priority:** Core for teaching rooms; additional resources applicable.

Unify room, lab, skills/simulation equipment and other shared capacity constraints. Include maintenance/calibration blackout, required training, booking approval, cancellation and actual usage. Distinguish group capacity from a single asset reservation.

**Acceptance:** concurrent bookings cannot oversubscribe capacity; timetable publication sees facility blackout; cancelled booking releases capacity once; inaccessible/unsafe resources cannot be silently assigned; usage charges connect to approved finance workflow if applicable.

### COMP-09 — Accessible support and confidential welfare

**Owner:** Student welfare/designated committees. **Priority:** Core.

Separate academic mentorship, disability/accommodation requests, general helpdesk, grievances, anti-ragging and sensitive complaints. Map restricted committee membership, escalation/appeal and anonymous reporting only where policy supports it. Avoid duplicating private clinical counselling notes into ERP.

**Acceptance:** ordinary mentor/support exports exclude confidential case detail; complainant sees safe status; removal of a committee member revokes case access; urgent channels remain reachable outside admission windows; accommodations reach only relevant authorized staff.

### COMP-10 — Approval continuity and exception resolution

**Owner:** Workflow owner. **Priority:** Core.

Specify due dates, escalation, authorized temporary delegation, reviewer unavailability and open-task reassignment. Version important approval rules. Escalation is not automatic approval. A person cannot bypass maker/checker separation by switching roles.

**Acceptance:** a departed reviewer does not strand tasks; delegation has scope/expiry; old actor cannot act after revocation; concurrent approvals yield one valid final transition; rejected/returned items preserve reason and evidence.

### COMP-11 — Master-data changes and controlled duplicates

**Owner:** Registrar/data steward. **Priority:** Core.

Provide import preview, source ID mapping, duplicate review, identity correction and safe merge where needed. Department/programme renaming and archival must not orphan records. Shared master changes have impact preview and permission controls.

**Acceptance:** person merge preserves references and audit and has a documented recovery path; authoritative external IDs cannot be reassigned silently; imports list accepted/rejected/duplicate rows; sensitive mass changes require reviewed change set.

### COMP-12 — Feedback, quality and corrective action

**Owner:** Academic quality team. **Priority:** Applicable, normally part of institution-wide rollout.

Manage course/faculty/clinical-posting feedback, meeting action items and corrective measures. Define anonymity threshold and access policy. Connect actions to evidence, owner, due date and review rather than presenting unverified performance rankings.

**Acceptance:** small-group feedback cannot identify respondents through drill-down; restricted raw comments stay protected; corrective action closure requires evidence; dashboard totals reflect actual submissions and approved formulas.

### COMP-13 — Programme-specific configuration

**Owner:** Programme authority. **Priority:** Core architecture; additional programmes applicable.

MBBS, MD/MS, internship, research degrees and nursing/allied-health programmes must not share one hard-coded academic workflow. Configure approved programme structures, assessment types, eligibility, required postings and certificate authority. Do not assert every programme has the same regulator or admission channel.

**Acceptance:** two test programmes use different rules without code forks or cross-contamination; version pinned to cohort; unconfigured programme is unavailable for enrolment rather than using guessed defaults.

### COMP-14 — Campus-service lifecycle

**Owner:** Relevant service manager. **Priority:** Applicable.

Library: renewals/reservations, lost/damaged items, approved fines and clearance. Hostel/mess: occupancy, transfers, checkout, charges and service issues. Inventory: receipt inspection, batch/expiry where needed, returns, disposal and reorder. Transport: route capacity, entitlements and incident routing where operated.

**Acceptance:** asset/bed/book cannot be allocated twice; charges reconcile to finance; departure triggers clearances without deleting history; unsafe/expired stock is unavailable; private student whereabouts are restricted.

### COMP-15 — Institutional records and disclosure control

**Owner:** Governance/quality office. **Priority:** Core with applicable templates.

Maintain committee terms/membership, approved minutes, correspondence/reference numbers and decision action items. Period-based evidence packs retain source provenance. Public disclosures use approved extracts, not a direct mirror of private admin tables.

**Acceptance:** pack reproduced after later source changes; expired evidence flagged; committee-private minutes never publicly indexed; template/regulatory version recorded; statutory submissions are not marked complete without real receipt/acknowledgement.

### COMP-16 — Exit, portability and support handover

**Owner:** Institution data owner and IT. **Priority:** Core before contractual handover.

Provide authorized export of agreed institution-owned data/documents with schema/data dictionary and manifest. Define encryption, recipient authorization, retention/legal holds, vendor deletion evidence where applicable and recovery. Disable departing staff/suppliers and rotate shared access safely. Document who supports database, app, identity and external providers.

**Acceptance:** export can be interpreted and verified; private records go only to authorized scope/recipient; credential rotation tested; service exit does not strand the institution without access to records; deletion is approved and demonstrable, not triggered by a casual admin click.

### COMP-17 — Peak-cycle readiness and continuity

**Owner:** IT/delivery lead. **Priority:** Core.

Test admissions deadline load, exam-result publication, bulk imports and document downloads. Combine observability with integration freshness, content/job failures and exception ownership. Rehearse disaster recovery for database, objects, identity configuration and pending durable jobs.

**Acceptance:** defined performance envelope measured; a submission acknowledged as successful is durable; recovery does not duplicate fees/enrolments; downtimes have user-facing guidance; RPO/RTO evidence exists; clinical continuity needs its own hospital-approved plan.

### COMP-18 — Website and form completeness remains mandatory

**Owner:** Web information/content manager and relevant offices. **Priority:** Immediate.

Implement the full institutional website upgrade prompt: substantive pages; header/footer; scoped CMS; notice/document dates and archives; admission stage separate from form window and verified seat publication; versioned applicable forms and tracked review.

**Acceptance:** admin-to-public publishing, applicant-to-reviewer workflow and all applicable WEB/NTC/ADM-W/FRM tests from that prompt pass. Content release status is tracked separately from technical feature completion. Government-style appearance must not become a false claim of government ownership/certification.

## 5. Universal completion rule

Apply the following to every enabled module, not just admissions:

1. **Purpose and owner:** the user need, accountable office and authoritative source are known.
2. **Management:** authorized staff can create/configure/review required records without developer edits.
3. **Persistent workflow:** state survives refresh/restart and follows correct lifecycle, including reversals/amendments.
4. **Integrity:** validation, permissions, concurrency and audit protect the business rules.
5. **User experience:** usable list/detail/action screens, mobile behaviour, dates, status and all error/empty/loading states.
6. **Communication:** notifications reflect actual state and delivery; sensitive data stays protected.
7. **Reconciliation:** dashboards/exports agree with source transactions and show missing/stale data.
8. **Exceptions:** duplicates, retries, unavailable reviewers/providers and changed records have a safe path.
9. **Evidence:** positive/negative end-to-end tests and relevant operational checks pass.
10. **Operation:** documentation, permissions, migration, backup and support responsibilities are ready.

A dashboard card, button, route, schema or optimistic success toast alone never satisfies this rule.

## 6. Minimum end-to-end business acceptance

| Journey | Required observable outcome |
|---|---|
| Public content | Editor drafts → reviewer publishes → anonymous user sees correct content → archive/withdrawal updates all public surfaces |
| Admission | Authorized application/allotment → validation → document correction → fee/waiver → one capacity-safe enrolment |
| Academic year | Cohort configured → sessions delivered → attendance approved → assessment and evidence → progression under pinned policy |
| Exam retry | First result → permitted supplementary attempt → independent reviewed outcome → consistent transcript history |
| Training | Posting → leave/makeup → supervisor sign-off → completion check → certificate when authorized |
| Finance | Invoice → partial/full payment → settlement → exception/refund → balanced close |
| Student exit | Completion/withdrawal → applicable clearances → official documents → correct account/alumni permissions |
| Staff change | Leave/exit → substitute/task handover → access revocation → uninterrupted approved work |
| Research | Protocol → recusal-aware review → amendment/renewal → controlled closure |
| Campus service | Allocation/issue → usage/charge → return/checkout → clearance without duplication |
| Confidential complaint | Restricted intake → correct routing → escalation → safe status/outcome with no unauthorized disclosure |
| Recovery | Representative backup restoration → durable event replay → no lost acknowledged submission or duplicate financial effect |

All applicable journeys must be traced to actual database records, API outcomes and UI evidence. Synthetic data is appropriate for tests; do not use real patient data.

## 7. Final completion prompt for the coding agent

Copy this section into the existing project together with the earlier documents:

> Audit and finish the existing Medical College Management application against the base PRD, full-stack engineering prompt, institutional website upgrade prompt and this final scope contract. Start with the incomplete public website; preserve working admin and business data. Then verify every applicable core domain end-to-end.
>
> Create one traceability matrix for SC-01–SC-30, COMP-01–COMP-18, original PRD IDs and website acceptance tests. For each, record scope/applicability, current evidence, missing work, release, implementation links, tests, result, owner and blocker. Never mark a feature complete based only on a menu or UI screen.
>
> Implement missing active-scope requirements across database, backend, permissions, validation, API, frontend, state handling, audit, reporting and tests. Reuse working services and avoid parallel conflicting data sources. Cover normal, rejected, duplicate, corrected, expired, conflicting and unavailable-provider cases.
>
> Specifically verify and complete academic rollover/progression, exam operations/supplementary attempts, exit/no-dues/certificates, faculty workload/substitution, financial reconciliation/closure, resources, confidential welfare, approval continuity, master-data integrity, programme configuration, records/exports and disaster recovery.
>
> Keep clinical/patient source-of-truth, counselling authority, university result authority and institutional approvals explicit. Where an external decision, credential or policy is genuinely missing, implement the safe integration/configuration boundary, flag the precise blocker and continue unrelated work. Do not invent rules, claim certifications, enable mock live payments or display fabricated seat data.
>
> Test all shipped active-scope workflows with actual persistence, negative authorization checks and responsive browser verification. Run build/type/lint checks, appropriate concurrency/integration tests, file/document checks and existing admin regressions. Record exact evidence and unrun checks. Maintain test data and repeatable run commands.
>
> Deliver a labelled synthetic client-demo environment with full realistic content and a rehearsed demo script. Separately report live-production blockers, verified content, real integrations, migration readiness, restore results and institutional acceptance. Continue implementation until the active agreed scope is done; do not return only a gap report or suggestions.

## 8. Scope and release control

The previous R0/R1 pilot remains a useful first release, not proof of the whole college system being complete. Place COMP additions into release milestones with dependencies and institution approval:

- **Immediate client demonstration:** public website/CMS, notices/documents, admissions/forms/tracking, truthful seat status and one real academic/admin journey.
- **Academic production readiness:** SIS, policy/curriculum, sessions/attendance, assessments/logbooks, finance, permissions, support, migration, backup and required progression/exam/clearance workflows.
- **Institution-wide completion:** applicable training, research, staff and campus operations plus all core lifecycle and operational requirements.
- **Separate specialist release:** newly built hospital clinical systems, multi-institution SaaS or optional AI/native apps, only if commissioned.

A required future workflow must be implemented and tested before it is needed in production. Do not hide missing mandatory functions indefinitely behind “phase 2”. Record exact release gates and dates with the institution. Avoid publishing unsupported fixed deadlines before discovery/estimation.

## 9. When can we say “complete”?

### Requirements-complete

Every agreed applicable business workflow has defined owner, policy/source, data, permissions, normal/exception path and acceptance test. Exclusions are documented and approved. No unresolved ambiguity blocks an implemented decision.

### Client-demo-ready

Selected client journeys work in a controlled environment with substantive clearly labelled synthetic content; no broken buttons/documents; evidence exists for the demo; limitations are disclosed.

### Production-ready for a release

All that release's mandatory requirements pass; no critical unresolved integrity/security issues; correct institutional content/configuration; real integrations and credentials; migration control totals; verified restore; monitoring/support/runbooks; authorized go-live.

### Complete for the agreed college scope

Every applicable core and commissioned institutional module satisfies the universal completion rule and actual stakeholder UAT. Optional excluded modules are not advertised as delivered. The evidence ledger, not a “100% complete” badge, supports the claim.

## 10. Final recommendation

**Product scope:** আগের documents + এই ১৮টি explicit lifecycle/operational additions মিলে client discussion এবং development acceptance-এর জন্য একটি পূর্ণাঙ্গ baseline।

**Immediate focus:** public website এবং admin-managed notices/admissions/forms শেষ করুন; একই সঙ্গে security/data integrity অক্ষুণ্ণ রেখে academic ও institutional gaps বন্ধ করুন।

**Honest current status:** actual code/UAT evidence ছাড়া application complete বা tested বলা যাবে না। Coding agent-কে উপরের acceptance contract অনুযায়ী implement ও verify করতে হবে। College-specific applicability, official policies এবং commissioned hospital scope final করলে “complete for this institution” নির্দিষ্টভাবে মাপা যাবে।
