# Medical College Website — Institutional Redesign, Dynamic CMS, Forms and Full-System Completion Prompt

**Version:** 1.0 · **Date:** 28 September 2026
**Purpose:** Upgrade an existing application whose admin is partly functional but whose public institutional website is incomplete.
**Companion files:** `medical-college-management-production-prd.md` and `medical-college-fullstack-production-build-prompt.md`.

## ব্যবহার

এই prompt existing project-এর coding agent-কে দিন। আগের PRD এবং full-stack prompt থাকলে সেগুলোও attach করুন। এবার public institutional website, manageable content, notices/admissions/forms এবং বাস্তব end-to-end testing সর্বোচ্চ priority। পুরোনো application-এর working admin ও data preserve করতে হবে।

এই ডকুমেন্ট actual application-এর audit report নয়—code/live application এখানে পরিদর্শন করা হয়নি। নিচের prompt agent-কে audit করে ঘাটতি implement এবং evidence দিয়ে test করতে বলছে। Demo content, verified institutional content এবং pending approval-এর পার্থক্য রাখতে হবে।

**Copy-paste kickoff:**

> Apply the attached institutional website upgrade prompt to the existing project. Audit the actual public website, admin, APIs and database; prioritize the public institute website. Implement the missing header/footer, complete content templates, dynamic CMS, notices, admission/seat status, form management and applicant workflows. Preserve working admin functionality. Verify every shipped workflow end-to-end and deliver a client-demo-ready build with honest implementation and test evidence. Do not stop after an audit or cosmetic redesign.

---

# MASTER PROMPT START

## 1. Mission and priority

You are responsible for completing and improving an existing Medical College Management application. The admin is partially built, but the public institute website currently lacks the completeness, institutional character and operational content management expected by the client.

Inspect the actual implementation, identify what works and what is missing, then implement the improvements. The priority is a complete public website connected to usable admin workflows, supported by reliable backend/database logic and tested alongside the existing medical college features.

The result should feel like a credible, content-rich Indian public medical institution: formal identity, clear navigation, current notices, detailed academic/admission information, useful forms, institutional transparency and service-oriented content. Use contemporary engineering and accessibility. Deliver original design quality and reliable task completion that we can confidently demonstrate to the client.

This prompt extends the previous PRD and master prompt. Where their generic public-site instructions conflict with this more specific website direction, use this direction. Retain their security, data-integrity and clinical boundaries. Existing business data, permissions and working admin workflows must remain intact.

Do not stop with a review document, visual mockup or plan. Complete implementation, migration, integration and verification for the active scope. Do not claim a feature is done merely because a route or button exists.

## 2. Start with a real audit

Read repository instructions, dependencies, schemas, routes, services, seed data and existing tests. Run the application and inspect rendered screens when tools permit. Trace public features to actual admin controls, APIs and database records.

Create `docs/website-gap-audit.md` with one row per feature:

`ID | user task | current route/screenshot | admin control | API | data source | current status | missing behaviour | priority | fix | verification evidence`.

Allowed statuses: verified working, partial, broken, missing, not applicable with reason, blocked by external dependency, untested. Distinguish user-reported symptoms from findings you actually reproduced.

Audit:

- All public routes, navigation, header/footer, content depth, mobile and keyboard usability.
- Whether public content is hard-coded, seeded only or genuinely editable/publishable.
- Notices, attached files, dates, expired items, search and archives.
- Programmes, admission cycles, seat matrix/vacancy source and deadlines.
- Every form, submission, upload, fee, tracking and admin review path.
- Existing medical-college modules against the PRD, including dependencies and exceptions.
- Security boundaries, source-of-truth decisions, migrations and regressions.

Do not label inaccessible/unrun workflows as passed. If repository or runnable access is missing, state the specific missing input; perform the available specification work without inventing inspection results.

### Priority order

1. P0: Complete site identity/navigation; essential page content; real CMS publishing; notices; admission status; approved applicable forms; permission and privacy controls; broken active workflows.
2. P1: Department/course depth; research/facilities; document archives; public search; operational analytics; additional relevant forms; content-quality dashboard.
3. P2: Optional integrations and enhancements supported by actual institutional demand.

A missing active PRD security or data-integrity requirement remains critical even if public UI work is prioritized. Do not rebuild working modules or change the technology stack without a concrete need.

## 3. Institutional visual direction

Design a professional government-medical-institution-style website, with readable information density and dependable navigation. Use actual approved college identity and content wherever available.

### Visual system

- A restrained deep navy or maroon institutional primary, warm/off-white background, clear dark text, modest accent colour and fine separators. Select one coherent palette compatible with approved branding.
- Visible bilingual institution name when applicable, correct emblem/logo proportions and clear affiliation/ownership text only when verified.
- Readable body text, accessible line spacing, disciplined heading hierarchy and well-aligned tables. Avoid tiny notice text.
- A modest campus/banner section; notices and admissions visible early, not buried under an oversized promotional hero.
- Structured sections, notice lists, academic directories, document tables and useful quick links; a consistent content width and interior-page sidebar pattern.
- Mobile navigation and tables designed deliberately. A formal institutional style must still work on a phone.
- Real authorized photography, meaningful captions and alt text. Use original artwork only if appropriate and labelled; do not present generated facilities/people as the real campus.
- No decorative startup slogans, inflated metrics, unrelated stock doctors, fake awards, copied official seals or fictional government ownership.

Accessibility controls, language switch, search, breadcrumbs, print and downloads must actually function. Do not create fake accessibility widgets. Where a control is unnecessary, use sound accessible design instead of a nonfunctional icon.

Use authorized institutional identity. Government-style presentation does not authorize claiming government ownership, NIC hosting, STQC certification or using the national/state emblem for an unrelated institution.

## 4. Complete global header and footer

### Header

Create consistent global layers:

1. **Utility bar:** skip to main content; language; accessibility/help link; contact/helpline where approved; audience or portal links.
2. **Institution masthead:** authorized logo, full institution name, translated name if available, verified affiliation/ownership, address summary, site search and clear portal entry.
3. **Primary navigation:** Home; About; Academics; Admissions; Departments; Hospital/Patient Services; Research; Notices; Student Services; Contact. Group secondary routes in accessible dropdowns/mega menus.
4. **Optional urgent notice band:** bounded start/end visibility, severity and direct detail link. Static readable presentation preferred; moving content must have pause controls.

Keyboard/touch navigation, active routes, focus states and mobile drawers must work. A parent item must not make submenu-only pages unreachable. Sticky headers must not cover anchors or focused controls. Protect required global navigation from accidental deletion, with an audited admin override when appropriate.

### Footer

Provide:

- Full institutional name, verified postal address and department contact directory.
- Useful links: admissions, notices, prospectus, student services, research, careers and tenders.
- Governance links where applicable: disclosures, RTI/contact officer, anti-ragging, grievance and institutional committees.
- Privacy, accessibility statement, terms, copyright/content-use policy, hyperlink policy, sitemap and help.
- Content owner/editor contact and genuine review/update information.
- Hosting/development credits only if factually correct and authorized.
- Social links only when verified and configured; no empty icons or dead anchors.

Admin must manage structured header/footer fields, approved links, ordering, visibility and languages, with preview and publish approval. Page update dates come from actual published content/review events, not the current browser time on every visit. Label footer dates with their real scope.

## 5. Complete page and content inventory

Each enabled page requires purpose, substantive approved content, ownership, review date, related actions, relevant documents and responsive layout. Do not make all pages copies of a generic hero plus three cards.

| Area | Required page content and actions |
|---|---|
| Home | Institutional introduction; latest categorized notices; current admissions/status; academic links; departments; research/news; facilities; quick services and contact |
| About | History, mission, institutional profile, verified affiliation, leadership and governance structure |
| Administration | Principal/dean message if approved; administrators; roles; office contacts and appropriate governance information |
| Academics | Programme catalogue, curriculum links, academic calendar, teaching resources and examination information |
| Course detail | Award/programme, duration, department, eligibility source, approved intake, fee schedule, curriculum, cycle-specific admissions, prospectus and contact |
| Admissions | Current and past cycles, important dates, admission mode, official counselling links, procedure, forms, fees, seat information and helpdesk |
| Department detail | Overview, HOD/faculty, teaching, services, research, facilities, approved contact and related notices |
| Faculty profile | Approved qualifications, appointment role, expertise, teaching/research and publications; no private identity/contact documents |
| Hospital services | Approved OPD/services, location, timings, patient guidance and real booking/referral links; no made-up live bed counts |
| Research | Projects, publications, ethics/research office guidance, collaborations and research facilities |
| Facilities | Library, laboratories, skills/simulation centre, hostels, classrooms and accessibility facilities verified by institution |
| Student services | Handbooks, forms, scholarships, hostel, certificates, grievance, counselling/support and anti-ragging guidance |
| Notices | Searchable current listings, detail page, attachments, corrections and archives |
| Exams/results | Schedules, exam forms, academic notices and approved result-access method; private individual results behind login |
| Forms/downloads | Filterable document/form directory with eligibility, instructions, online/offline/external mode and deadlines |
| Careers | Vacancy advertisement, eligibility, application mode, dates, corrections and approved results; no invented vacancies |
| Tenders | Approved tenders, bid dates, documents, corrigenda and outcomes; electronic bidding only if explicitly in scope |
| Disclosures | Applicable institutional/regulatory disclosures with owner, period, evidence, format and last review |
| RTI/transparency | Applicable officer/contact, procedure and approved disclosure documents; applicability confirmed |
| News/events/gallery | Dated stories, event details, licensed media, captions and archives |
| Alumni | Institutional alumni information; verified optional participation/registration |
| Contact | Office/department directory, hours, postal address, map/address alternative, enquiry and feedback |
| Policies/help | Clear content ownership, support, privacy, accessibility, usage policies, sitemap and search help |

Build complete reusable content templates and admin authoring tools even where actual institutional copy is pending. In public production, required missing content is a release blocker; optional empty pages are unpublished. In a controlled client demo, use substantive synthetic content labelled as demonstration throughout the environment. Do not solve content gaps by inventing institutional facts.

## 6. Home page layout and usefulness

Use this structural baseline and refine based on real content:

1. Utility bar, masthead and primary navigation.
2. Urgent/time-sensitive notice if any.
3. Modest institutional banner with clear caption and useful destination.
4. Prominent Notice Board and Admissions panel: dated notice rows, category, status, full listing links.
5. Quick services: apply/registration where genuinely open, application tracking, prospectus, academic calendar, forms/downloads and contact.
6. About/leadership preview with detail links, not an unsupported generic mission statement.
7. Programmes and departments.
8. Research, hospital/facilities and student-support entry points.
9. News/events and approved gallery.
10. Full footer.

All blocks come from approved CMS or domain data. Admin can choose/order supported sections with safe layout constraints; do not offer arbitrary executable code or uncontrolled HTML. Hide empty optional sections without collapsing the page into an unfinished skeleton. Notices and admissions remain discoverable without scrolling through all secondary content.

## 7. Dynamic CMS and content governance

Add or complete a **Website Management** area inside the existing admin:

- Site Identity and Languages.
- Header, Menus, Footer and Quick Links.
- Pages and Home Sections.
- Departments, Faculty and Programmes.
- Notices/Circulars, News/Events, Documents and Archives.
- Admission Cycles, Seat Publication and Deadlines.
- Forms/Templates, Application Windows and Submission Queues.
- Research/Facilities, Careers/Tenders and Disclosures.
- Media Library, Redirects, SEO and Public Search.
- Content Review, Broken Links, Expired Content and Publishing Audit.

### Content model

Content records include stable ID, slug, content type, locale, title, summary/body/structured sections, institution scope, owner, editor, reviewer, status, revision, publication time, review due date, archive rule and optional expiry. Store related document references and domain links, not duplicate unrelated hard-coded arrays.

Publishing: draft → review → approved → scheduled/published → archived/withdrawn. Returned drafts preserve comments and revision history. Restoring a previous version creates a new revision. Unpublishing clears public caches and search entries. Audit actor, timestamp, change and approval; no editor can gain arbitrary admin or clinical permissions through CMS.

Create safe preview and revision comparison. Provide department-scoped editors with central publishing approval. Translation approval is independent; draft translated copy must not leak publicly.

### Operational content checks

Dashboard flags missing required content, ownerless pages, overdue reviews, inaccessible/missing attachments, broken links, invalid dates, unpublished menu targets and stale admission/seat information. Every exception has a responsible owner and remediation state. Scheduled monitoring is implemented through the application's documented jobs, not claimed without a running scheduler.

Add publishing validation for mandatory fields and referenced assets. Distinguish public attachments from private applicant documents at schema, API, storage and permission layers.

## 8. Notice board and document lifecycle

### Notice fields

Title; reference/notice number; issuing department; category; audience; short description and full accessible text; issue date; publish date/time; application/action deadline where relevant; urgency/pinned/new-until period; language; document attachments; related programme/cycle/form; corrigendum/supersedes relation; approved status; review/archive dates; source and owner.

### Public behaviour

- Categories: General, Admission, Academic, Examination, Results, Recruitment, Tender, Student Welfare, Research and approved institution-specific categories.
- Filter by category, year, department, keyword and current/archive state; keep filters in URL and support pagination.
- Each notice has a stable detail route with full explanation, precise relevant dates and related actions.
- Attachments show title, file type, size, language and version. Provide accessible HTML summary and accessible document alternative where needed.
- “New” badge expires automatically. Closed notices remain available as history but cannot advertise active applications.
- Corrections clearly link original and revised notice; preserve both with superseded labels. Never silently replace an official file without version history.
- Archiving is distinct from closing applications and withdrawing incorrect content.
- Approved public documents remain publicly retrievable unless legally/policy withdrawn; private submissions never appear in public document search.

Automated tests must cover date boundaries, future scheduling, expiry, archive filters, corrections and real file preview/download. A file icon without a functioning file is not complete.

## 9. Admission cycles and accurate seat information

Separate three concepts in both UI and backend:

1. **Admission/counselling stage:** announced, scheduled, ongoing, reporting, completed, cancelled.
2. **Local form window:** not yet open, open, paused, correction-only, closed.
3. **Official seat/vacancy publication:** verified current snapshot, stale snapshot, not yet published, unavailable or withdrawn.

“Applications open” does not imply that a seat is available. “Seat vacant” does not authorize admission outside the correct counselling/allotment process.

### Cycle information

Programme, academic year, quota/round where applicable, admission authority/mode, source notice, eligibility and fee references, start/end/reporting/correction dates with timezone, documents checklist, applicable form version, contact/helpdesk, allowed operations and publish approval.

### Seat matrix

Represent sanctioned/approved intake, institution capacity and official quota/category/round vacancy snapshots separately. Each displayed number has period/round, source document/system, issuer, as-of timestamp, verification and publication approval. Display current source/freshness next to the table and keep prior snapshots in archive.

Do not calculate official counselling vacancy as intake minus website applications. Do not double-count overlapping categories or quotas; use a validated schema and definitions approved by the institution. Where the college genuinely owns an allocation ledger, reconcile it through transactional admission rules and authoritative confirmation before publishing.

If no trustworthy data exists, show “Seat vacancy not yet published” or “Refer to the official counselling notice” with the correct configured link. Never invent zero, a positive seat count or an “Available” badge.

### Time and concurrency rules

Backend time determines open/closed status using stored timestamps and institution timezone. Define start-inclusive and end-exclusive submission semantics explicitly in UI/terms/configuration. Stale UI, multiple tabs, disabled JavaScript or manually crafted requests cannot submit after closure. Approved extensions/corrections are versioned, audited and reflected in public copy.

Final admission is distinct from form submission/payment. Seat reservation/enrolment uses existing tested transactional rules; two requests must not take the last seat twice. Historical admitted students and documents survive an admission-cycle archive.

## 10. Forms: inventory, relevance and complete management

Audit which forms already exist and whether they actually serve institutional workflows. Do not add every conceivable form blindly. Record each as required, optional, external-only or not applicable with rationale and owner.

| Form family | Typical use | Destination |
|---|---|---|
| Admission enquiry | Ask programme/process questions | Admissions helpdesk |
| Allotted-candidate registration/reporting | Submit documents after valid external allotment | Admissions verification; not a substitute counselling portal |
| Institution-authorized course application | Apply where college is authorized to accept applications | Programme admission review |
| Document correction/resubmission | Resolve missing or rejected documents | Assigned verifier |
| Hostel application | Request permitted accommodation | Warden/allocation queue |
| Scholarship/fee concession | Request eligible support where locally managed | Student welfare/finance |
| Certificate/transcript/NOC | Request academic documents | Registrar approval |
| Student leave/permission | Request academic/posting leave | Academic supervisor |
| Internship/elective/observership | Apply for approved training opportunities | Training coordinator |
| Recruitment | Apply to a real published advertisement | Restricted HR review |
| Research/project proposal | Submit institutional proposal | Research office; links to IEC where required |
| Ethics submission | Protocol review by authorized users | Restricted IEC workflow |
| Seminar/workshop registration | Register for a real event | Event coordinator |
| Alumni registration | Opt into alumni participation | Alumni verification |
| General grievance/feedback | Track and respond to feedback | Assigned responsible office |
| Anti-ragging/sensitive complaint | Confidential reporting according to approved institutional process | Restricted designated committee |
| RTI-related service | Approved procedure/contact or authorized intake if applicable | Responsible officer/external official service |
| Vendor/tender enquiry | Request clarifications for published tender | Procurement office; not an unapproved e-bidding system |

Respect independent complaint channels and deadlines. Never close an urgent safety-reporting channel merely because admissions closed. Public forms collect the minimum necessary information. Sensitive forms need dedicated permissions; generic helpdesk staff must not inherit access.

## 11. Versioned form builder and applicant journey

### Admin builder requirements

Provide controlled schema-based forms with text, paragraph, email, phone, number, date, select, radio, checkbox group, approved address/qualification sections, file upload, consent/declaration and repeatable groups where needed. Field keys are stable; labels/helper text are localizable.

Configure required/optional fields, bounds, allowlisted conditional visibility, document requirements, instructions, application window, applicable programme/cycle, review steps, notifications, fees if authorized, duplicate policy and acknowledgement template. Do not allow arbitrary JavaScript, executable expressions or unsafe HTML in forms.

Preview phone/desktop, validate schema and test sample submission before publication. Published schema is immutable; new field changes create a version. A submission retains the exact schema, policy, declaration and fee version used. Version migration for an in-progress draft must be explicit; submitted applications cannot be silently reinterpreted under new rules.

### Applicant experience

1. Read eligibility/process, dates, checklist, privacy purpose and submission mode.
2. Authenticate/verify contact where required. Low-risk enquiries may be public with accessible abuse controls; sensitive tracking requires stronger verification.
3. Save and resume server-backed draft where supported; see actual saved state and privacy-safe timeout warning.
4. Complete accessible steps with client-side feedback and authoritative server validation.
5. Upload bounded allowed files with progress, scan state and replace/remove actions while editable.
6. Review exact answers, declaration and any applicable fee before submission.
7. Submit idempotently; receive stable application number and accurate pending/payment/submission state.
8. View/download a permission-protected acknowledgement and track progress securely.
9. Respond to requested corrections within an authorized window; receive outcome and next steps.

### States and admin review

Draft → Submitted → Under Review → Clarification Required → Resubmitted → Approved/Rejected/Waitlisted where relevant → Completed/Withdrawn. Payment states are independent, with a documented policy for whether payment precedes valid submission. Form approval is not automatically medical admission or course allotment.

Admin can filter, assign, inspect documents securely, record checklist decisions, request clarification, add internal notes, approve/reject with reason and export authorized data. Require independent approval for sensitive decisions. Submission history and applicant-visible status must stay consistent. Mask sensitive exports and avoid public searchable applicant documents.

Handle duplicate submissions, inconsistent conditional answers, malicious unknown fields, missing documents, interrupted uploads, session timeout, payment timeout, back-button/resume behaviour and simultaneous edits.

## 12. Frontend/backend/database integration

Preserve the project's existing coherent stack and previous master prompt. Public content and form functionality must connect to actual persistent APIs.

### Suggested domain entities

SiteSettings; NavigationMenu/MenuItem; Page/PageRevision; ContentTranslation; DepartmentPublicProfile; ProgrammePublicProfile; Notice/NoticeRevision/NoticeAttachment; PublicDocument; AdmissionCycle; SeatSnapshot/SeatSnapshotRow; FormDefinition/FormVersion; ApplicationWindow; Submission/SubmissionRevision; Answer; PrivateAttachment; ReviewAssignment; Decision; ApplicationEvent; ContactTicket; PublicationEvent; Redirect; ContentReviewTask.

Reuse existing domain entities when appropriate instead of creating duplicate student/payment/admission sources of truth. Add migrations and foreign keys. Bind institution scope and verify relationships. Index public visibility/category/date/locale and admin review filters. Protect archive/history and existing production data.

### API boundaries

- Public endpoints return only approved visible content, scoped to institution/locale and current effective dates.
- CMS management endpoints require scoped roles and publishing permissions.
- Submission endpoints enforce active window, form version, validation, identity, attachments and idempotency server-side.
- Tracking endpoints require applicant identity or safe verified access; application number plus publicly knowable date of birth is not sufficient protection for sensitive data.
- Review decisions, fee changes and deadline overrides are audited.
- Private upload URLs are bounded and authenticated; scanning must complete before reviewers access untrusted files according to the safe preview design.
- Payment confirmation uses verified provider events/authoritative status; no successful payment from browser redirect alone.

### State and cache

Use the existing query layer consistently. Keep form values in form state, server records in query cache and filters in URL. Permissions remain backend-owned. Do not cache private submissions in shared server/CDN caches or public service-worker storage.

Publish/unpublish/menu updates invalidate relevant public caches, search and sitemap. Set a tested freshness target: ordinary published changes visible on controlled production paths within 60 seconds unless the existing architecture supports faster. Time-bound notices/forms must reflect server validity even if scheduler/invalidation is delayed. Invalidate downstream mirrors; version/freshness indicators expose stale reads honestly.

Authorized cache purge and previews must not provide a route to private records. URLs, downloadable attachments and old slugs require redirect/withdrawal behaviour rather than accidental broken links.

## 13. Full medical-college completeness review

After resolving the website priorities, evaluate the broader product from each stakeholder's perspective. Trace meaningful journeys instead of counting pages.

| Perspective | Questions to verify |
|---|---|
| Prospective applicant | Can I identify courses, real eligibility, admission mode, dates, seat source, required documents, fees and next action? |
| Applicant | Can I submit, pay if required, get proof, track securely, correct documents and understand outcome? |
| Student | Can I see my timetable, attendance explanation, learning material, published results, fees, documents and requests? |
| Faculty | Can I capture sessions, correct attendance through approval, assess learners and verify logbooks without duplicate work? |
| Registrar | Can I verify applications, prevent duplicate enrolment, issue documents and reconcile authoritative records? |
| HOD/dean | Can I see evidence-backed competency progress, shortages, staffing, approvals and reports? |
| Finance | Can I reconcile invoices/payments/refunds and inspect exceptions without clinical access? |
| Training coordinator | Can I schedule rotations, resolve leave/completion gaps and approve internship/PG evidence? |
| Research/IEC | Are protocol versions, reviewer conflicts, approvals, expiry and confidentiality enforced? |
| Hospital team | Does the academic bridge respect clinical source ownership, patient privacy and sync freshness? |
| Website editor | Can I manage all public sections without a developer and verify published results? |
| IT/support | Can I monitor failures, restore backups, handle tickets, update dependencies and audit access? |

Map existing PRD requirements to verified/partial/missing status. Implement gaps in the active approved scope, including critical integration/security dependencies. For optional complex HMIS/clinical or unapproved institutional processes, specify precise blockers and readiness work without fabricating a working integration. Do not equate “all features” with uncontrolled scope expansion or a set of placeholder screens.

## 14. Content completion and client demonstration

Create `docs/content-inventory.md` with page/section, required copy/data, source, owner, review date, status and demo/live classification.

### Content quality gate

- No lorem ipsum, duplicate generic descriptions, empty numbered sections, broken images or `#` action links on demo routes.
- Every enabled public page has substantial task-relevant content and working navigation.
- Required institutional facts/documents are verified or explicitly pending for live release.
- Synthetic examples are isolated in a labelled nonpublic demo environment with search indexing discouraged and access restricted as appropriate; do not rely on robots.txt as access control.
- Demonstration notice documents and forms open correctly and carry clear demo labelling. Never fabricate real official signatures or government orders.
- Synthetic fixtures cover open/upcoming/closed forms, different notice categories, corrected/archived notices and seat data unavailable/stale/verified-demo cases.
- Demo datasets are resettable and contain no real student/patient/identity data.

### Client demo script

Prepare a tested journey:

1. Open institutional home on desktop and phone; locate current notices and admissions quickly.
2. Visit course/department detail and open an accessible document.
3. In admin, edit a header/footer item and page content; review/publish; verify anonymous public page updates.
4. Publish a notice with attachment and expiry; verify category listing, detail and download.
5. Configure a demo admission/form window and approved-demo seat snapshot; show independent statuses and source date.
6. Submit a relevant form with validation/upload; receive acknowledgement and track status.
7. Admin requests a correction; applicant resubmits; reviewer completes decision; history remains intact.
8. Close the window; show that both public CTA and manually attempted submission obey closure.
9. Show one genuine existing academic workflow and regression test outcome.

Client presentation must demonstrate implemented behaviour. Do not claim superiority with unverifiable comparisons; show measurable task completeness, clarity and evidence instead.

## 15. Test every shipped behaviour

Build a feature-to-test matrix. Each implemented feature has automated coverage where practical and recorded manual/browser checks for visual/content correctness. Test both positive and negative paths; do not claim exhaustive testing of every possible input.

| Test | Scenario and required outcome |
|---|---|
| WEB-01 | Header/footer render consistently across all enabled public templates at desktop and mobile widths |
| WEB-02 | Keyboard/mobile navigation reaches every visible destination; skip link and focus work |
| WEB-03 | Admin edits identity/menu/footer; approved changes appear publicly and persist after restart |
| WEB-04 | Draft/private/rejected pages and documents are absent from anonymous API, search, sitemap and direct URLs |
| WEB-05 | Published content revision updates public view; rollback is versioned; unpublish clears old caches |
| WEB-06 | Required content validator detects empty/ownerless/broken sections; no dead CTA in enabled routes |
| NTC-01 | Notice filters, search and pagination return accurate categories/dates; detail and files open |
| NTC-02 | Future notice is hidden until valid; New badge expires; archived notices remain findable |
| NTC-03 | Corrigendum links both versions; withdrawn/superseded document behaviour is clear |
| NTC-04 | Download metadata and accessible summary match the actual file; missing file is reported safely |
| ADM-W01 | Admission stage, form window and seat status remain distinct in all combinations |
| ADM-W02 | Missing/stale/unverified seat data never appears as a current positive availability claim |
| ADM-W03 | Counselling source links, round/category labels and publication timestamp match approved snapshot |
| ADM-W04 | Server rejects submissions before opening/after closure despite stale page or manipulated request |
| ADM-W05 | Extension/correction-window approval updates dates without altering historical submissions |
| FRM-01 | Each enabled form renders correct version, conditions, required fields and instructions |
| FRM-02 | Client validation bypass still fails backend rules; invalid/unknown fields and hidden-field injections rejected |
| FRM-03 | Draft save/resume works after reload; unrelated applicant cannot read/edit draft or files |
| FRM-04 | Allowed uploads scan and attach; oversized/disguised/malicious files rejected or quarantined |
| FRM-05 | Double click/retry yields one logical submission and acknowledgement; network-uncertain outcome reconciles |
| FRM-06 | Changing published form produces new version; previous submissions retain original interpretation |
| FRM-07 | Review → clarification → resubmission → decision works with audit and proper notifications |
| FRM-08 | Application reference guessing cannot disclose another applicant's status/documents |
| FRM-09 | Payment callbacks are verified/deduplicated; client redirect alone cannot mark paid; fee-free form works |
| FRM-10 | Export permissions, CSV formula protection and sensitive-field masking work |
| SEC-01 | CMS/department editor cannot elevate privilege, bypass publisher rules or access private complaints |
| SEC-02 | Stored rich-text XSS, unsafe links, CSRF and object-ID substitution are handled correctly |
| SEC-03 | Logout/account switch clears private cached data; public caching does not leak submissions |
| REG-01 | Existing admin/student/faculty/finance golden journeys pass after changes |
| OPS-01 | Scheduled publish/archive, failed-job retry and integration exceptions are observable and replay safe |
| OPS-02 | Database and object restoration preserves links, submissions and version histories |
| UX-01 | Phone/tablet/desktop checks, keyboard flow, readable zoom and screen-reader form labels pass |
| UX-02 | Broken-link/route crawl finds no broken internal link on published/demo routes |
| UX-03 | Loading, empty, failed, stale, forbidden and successful states are correct; no console/hydration errors |

Test date boundaries with controllable time, including delayed jobs and client/server timezone differences. Test actual file bytes and persisted records, not only toast messages. Use real database integration tests and browser end-to-end tests for critical journeys; MSW/mocks supplement but do not replace them.

Run type checking, lint, relevant automated tests and production build. Fix introduced regressions. Record test command, environment, outcome and evidence. If a check cannot run, label it blocked/untested and explain the exact cause. Never disable a failing test or compiler rule simply to report success.

## 16. Accessibility, content governance and operations

Use official GIGW guidance as a reference for applicable government-site quality/lifecycle expectations, with an applicability checklist. Target accessible semantic markup and the project's agreed WCAG standard; do not claim formal compliance or certification without the required assessment.

Provide readable headings, table captions/headers, input labels, keyboard focus, contrast, descriptive links, meaningful alt text, captions where needed and accessible document alternatives. Important deadlines and notices cannot exist only inside a scanned image. Language toggle reflects real reviewed translations, not an English page with translated navigation alone.

Integrate with existing monitoring and maintenance:

- Alert on scheduled-publish/archive failures, overdue content, missing public files and expired form/deadline inconsistencies.
- Monitor application/API errors, submission/payment exceptions, queue lag and upload scans.
- Assign content review/approval, admissions and technical incident owners.
- Back up website content, documents, form schemas, submissions and audit; rehearse restoration.
- Provide least-privilege editor roles, secure configuration, patch/dependency process and operational runbooks.
- Track admissions peak capacity; assess PRD performance targets with representative load and uploads.
- Privacy/retention and public-result publication rules require institutional approval; no automatic publication of personal applicant results or documents.

## 17. Implementation order and deliverables

### Execute in this order

1. Audit current routes/admin/API/data and capture baseline screenshots/test results.
2. Implement institutional design tokens and global header/footer/navigation; preserve working portal UI.
3. Complete structured CMS, page templates and content ownership/publishing.
4. Connect notice/document management, search, archive and date lifecycle.
5. Implement admission cycles, separate seat status and source-aware publication.
6. Complete applicable form schemas/windows, applicant journey and admin review.
7. Fill substantive demo content, mark live-content blockers, and verify all public routes.
8. Close active-scope gaps in academic/operational modules and regression test existing functionality.
9. Harden security, caching, scheduled work, migrations, accessibility and recovery.
10. Produce final evidence and run the exact client demo walkthrough.

### Maintain these project artifacts

- `docs/website-gap-audit.md`
- `docs/public-sitemap.md`
- `docs/content-inventory.md`
- `docs/cms-editor-guide.md`
- `docs/forms-catalogue.md`
- `docs/admissions-seat-data-rules.md`
- `docs/requirements-traceability.md`
- `docs/test-evidence.md`
- `docs/client-demo-script.md`
- `docs/implementation-status.md`
- Updated architecture, API, database, deployment and maintenance documentation where changed.

### Definition of done

A feature is done when an authorized administrator can manage it; the backend validates and persists it; the appropriate public/applicant/staff view shows the correct approved version; permissions/date rules hold; nonhappy paths are handled; and tests/evidence demonstrate the full workflow.

The client demo is ready when selected journeys are fully working with clearly labelled synthetic data and no broken content/actions. Live production readiness additionally requires verified institutional content, approved policies, real integration setup and operational/release gates. Report these statuses separately.

### Final report format

1. What was changed and why, grouped by user outcome.
2. Before/after findings and actual screenshots where available.
3. Feature completeness and remaining blocked/unapproved items.
4. Tested journeys, commands, results and unrun checks.
5. How the admin manages pages, notices, seats and forms.
6. Exact local/staging start steps and migration notes.
7. Client demo script and live-launch requirements.

Do the implementation rather than returning only recommendations. Continue through the active scope, preserve the user's existing work and make any material missing dependency explicit.

# MASTER PROMPT END

---

## Reference basis

- [GIGW conformity matrix](https://guidelines.india.gov.in/annexure-ii-matrix-to-check-conformity/): official reference for ownership, document information, current/archived content and usable public information.
- [GIGW lifecycle guidance](https://guidelines.india.gov.in/lifecycle-management/) and [policy templates](https://guidelines.india.gov.in/policy-templates-for-stqc-certification/): reference for ongoing contribution, review and archive responsibilities.
- [AIIMS](https://aiims.edu/): public medical-institution reference; inspect approved current pages for information hierarchy rather than copying branding.
- [IPGME&R/SSKM](https://www.ipgmer.gov.in/) and [admission information](https://ipgmer.gov.in/mbbs_admission_2026_all_india): local institutional reference showing admission guidance connected to external allotment/counselling. In this review, the home page direct fetch failed; search-indexed content was available.

Detailed workflows, UI choices, data rules and tests above are proposed product requirements. They are not claims that every reference website implements those functions. Formal legal/regulatory applicability and institutional policies must be verified before live launch.
