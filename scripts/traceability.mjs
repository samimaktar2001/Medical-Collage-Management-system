import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const spec = readFileSync('docs/source/medical-college-management-production-prd.md', 'utf8');
const details = {
  'FND-01': [
    'Partial',
    'Organization master create/list; referenced records not deleted. Campus hierarchy and retirement UI pending.',
    'masters',
  ],
  'FND-02': [
    'Partial / externally blocked',
    'Scoped development sessions, revocation, CSRF and role checks tested. Production OIDC, MFA, recovery, scope administration not implemented.',
    'auth',
  ],
  'FND-03': [
    'Partial',
    'Draft and independently approved effective-dated policies. Cohort binding, policy history and institutional values pending.',
    'policies',
  ],
  'FND-04': [
    'Partial',
    'Append-only product API audit on writes and exports. Read coverage, immutable storage, retention and shared correlation context pending.',
    'audit',
  ],
  'FND-05': [
    'Partial / externally blocked',
    'Owner-only quarantined upload with size/signature/checksum; download denied until clean. S3, scanner, versioned attachments pending.',
    'documents',
  ],
  'FND-06': [
    'Partial',
    'Sensitive actions block same-actor approval. Delegation, expiry and escalations pending.',
    'approvals',
  ],
  'FND-07': [
    'Partial',
    'Unknown and later-release APIs denied. Configurable feature prerequisites and admin enablement pending.',
    'routing',
  ],
  'CMS-01': [
    'Partial',
    'Owned plain-text pages/notices/events/disclosures; revision and approved public payload. Rich editor, specialized directory schemas pending.',
    'content',
  ],
  'CMS-02': [
    'Partial',
    'Draft/review/publish/archive/revise; author/publisher separation. Scheduling and restore UI pending.',
    'content',
  ],
  'CMS-03': [
    'Partial / institutional approval',
    'Synthetic public department, faculty and disclosure pages only. Institutional approved directory data pending.',
    'content',
  ],
  'CMS-04': [
    'Partial',
    'Approved-content search, per-page metadata, sitemap and 404. SEO crawl disabled intentionally for demo; redirect governance pending.',
    'public/content',
  ],
  'CMS-05': [
    'Partial / externally blocked',
    'Rate-limited enquiry persists support ticket with on-screen reference. Email acknowledgement blocked by provider.',
    'public/enquiry',
  ],
  'CMS-06': [
    'Partial / institutional approval',
    'Independent en/bn content rows and explicit English fallback. Reviewed Bengali copy pending.',
    'content',
  ],
  'ADM-01': [
    'Implemented local slice',
    'CSV-to-API import with source batch, per-row results, duplicate external refs and result download; 1,000-row limit.',
    'applications/import',
  ],
  'ADM-02': [
    'Partial',
    'Verification flags, clarification reason and independent approval. Policy-specific checklist and scanned document versions pending.',
    'applications',
  ],
  'ADM-03': [
    'Partial',
    'Transactional final-seat guard tested with competing requests. Approved quota and reserved-pool policy pending.',
    'applications',
  ],
  'ADM-04': [
    'Partial',
    'Guarded enrolment and retry-safe stable student ID tested. Official admission-letter issuance pending.',
    'applications',
  ],
  'ADM-05': [
    'Not implemented',
    'Withdrawal, transfer, custody and coupled refund policy remain pending.',
    'applications',
  ],
  'SIS-01': [
    'Partial',
    'Stable student record and enrolment ID. Historical enrolments, governed merge and transfers pending.',
    'students',
  ],
  'SIS-02': [
    'Partial',
    'Own attendance/results/fees/logbook plus certificate, leave and appeal request decisions. Official fulfilment pending.',
    'students / requests',
  ],
  'SIS-03': [
    'Not implemented',
    'Institution-approved certificate templates, signatures, verification and revocation not implemented.',
    'requests',
  ],
  'ACA-01': [
    'Partial',
    'Unique competency code/version with source catalogue. Cohort assignment and bulk import pending.',
    'competencies',
  ],
  'ACA-02': [
    'Partial',
    'Session requires competency, faculty, cohort, time and location. Separate plan publication workflow pending.',
    'sessions',
  ],
  'ACA-03': [
    'Partial',
    'Faculty/room/cohort overlap guarded with institution lock. Clinical capacity and documented exception workflow pending.',
    'sessions',
  ],
  'ACA-04': [
    'Implemented local slice',
    'Assigned faculty capture, complete finalization, duplicate row protection and lock tested.',
    'sessions',
  ],
  'ACA-05': [
    'Partial',
    'Reasoned independently approved correction and cancelled-session exclusion tested. Shortage notification delivery pending.',
    'corrections',
  ],
  'ACA-06': [
    'Partial / institutional approval',
    'Separate categories, provisional missing/unfinalized evidence. Cohort-bound approved policy and denominator rules pending.',
    'attendance-summary',
  ],
  'EXM-01': [
    'Partial',
    'Competency, maximum, examiner and textual rubric retained. Structured components and full plan approval pending.',
    'assessments',
  ],
  'EXM-02': [
    'Partial',
    'Score bounds and explicit absent/withheld states, entry lock and versions. Post-lock correction workflow pending.',
    'assessments',
  ],
  'EXM-03': [
    'Partial',
    'Independent publication, frozen marks snapshot and student visibility tested. Formal revocation notices and reissue workflow pending.',
    'assessments',
  ],
  'EXM-05': [
    'Partial',
    'Student appeal requests require dean decision. Deadline policy and amended result generation pending.',
    'requests',
  ],
  'LMS-01': [
    'Partial',
    'Scoped resources/assignments, persisted submissions, deadlines, extension reasons and feedback. Submission revision workflow pending.',
    'learning / submissions',
  ],
  'LOG-01': [
    'Partial',
    'Competency/activity/date/posting/supervisor entries, obvious identifier rejection. Complete identifier detection and upload review pending.',
    'logbook',
  ],
  'LOG-02': [
    'Partial',
    'Assigned supervisor verify/return/reject with note, versions and no self-approval. Structured rubric signature pending.',
    'logbook',
  ],
  'LOG-03': [
    'Partial',
    'Verified/returned states tracked. Dedicated competency progress and remediation task workflow pending.',
    'logbook',
  ],
  'FIN-01': [
    'Partial',
    'Issued immutable base amount, fee-version reference, due date, minor-unit money. Approved fee schedules, waivers and adjustments pending.',
    'invoices',
  ],
  'FIN-02': [
    'Externally blocked / not implemented',
    'No live provider, sandbox or verified webhook adapter. No online paid action exposed. Offline payment path works separately.',
    'invoices',
  ],
  'FIN-03': [
    'Not implemented',
    'Settlement matching, provider fees, exceptions and closure report pending.',
    'payments',
  ],
  'FIN-04': [
    'Partial',
    'Reserved balance, independent approval and confirmed manual refund tested. Provider refund adapter and accounting journal pending.',
    'refunds',
  ],
  'FIN-05': [
    'Partial',
    'Unique offline bank/cash receipt references and invoice allocation. Double-entry ledger, reversal and accounting export pending.',
    'payments',
  ],
  'OPS-08': [
    'Partial',
    'Committee-only confidential concerns tested against admin search/detail. SLA escalation, attachment sharing and committee configuration pending.',
    'tickets',
  ],
  'GOV-01': [
    'Partial',
    'Frozen academic JSON snapshot, source manifest and SHA-256 export tested. Configurable source selection, expiry and asynchronous export jobs pending.',
    'evidence',
  ],
  'COM-01': [
    'Partial / externally blocked',
    'Audience-scoped notices and transactional outbox. Delivery worker/provider receipts and preferences pending.',
    'notices',
  ],
  'COM-02': [
    'Partial',
    'Scoped tickets, priority, due date, assignment and resolution. Full SLA and reassignment history UI pending.',
    'tickets',
  ],
  'ANA-01': [
    'Partial',
    'Authorized DB counts with definitions and refresh time, linked tables. Full filtered period reports and KPI fixture reconciliation pending.',
    'dashboard',
  ],
};
const seen = new Set(),
  rows = [];
for (const line of spec.split('\n')) {
  const match = line.match(/^\|\s*([A-Z]{2,3}-\d{2})\b([^|]*)\|\s*([^|]+)\|/);
  if (!match || seen.has(match[1])) continue;
  const [, id, suffix, title] = match;
  seen.add(id);
  if (['AS', 'UAT'].includes(id.split('-')[0])) continue;
  const release = suffix.includes('/')
    ? suffix.split('/')[1].trim()
    : id.startsWith('NFR')
      ? 'Cross-release'
      : 'Unspecified';
  const item = details[id] || [
    id.startsWith('NFR') ? 'Unverified release gate' : 'Future / gated release',
    id.startsWith('NFR')
      ? 'See security, UAT and operations docs. Production-scale verification not completed.'
      : 'Not implemented. Remains in the source PRD; disabled in the application.',
    '—',
  ];
  const test = details[id]
    ? 'tests/domain.test.ts, tests/http.test.ts, tests/learning.test.ts (only scenarios explicitly named there)'
    : 'Not run';
  rows.push(
    `| ${id} | ${release} | ${title.trim()} | ${item[0]} | ${item[2]} | ${item[1]} | ${test} |`,
  );
}
mkdirSync('docs', { recursive: true });
writeFileSync(
  'docs/requirements-traceability.md',
  '# Requirement traceability\n\nThe PRD remains authoritative. This is a working development implementation, **not a completed R0/R1 production release**. “Implemented local slice” does not imply institutional approval or production certification. Screens are selected with `/?view=<resource>`. Core implementation: `apps/api/src/domain.ts`, `learning.ts`, `main.ts`; frontend: `apps/web/app`. All IDs below are retained rather than silently removed.\n\n| ID | Release | Requirement | Status | API / screen | Implemented scope and remaining work | Evidence |\n|---|---|---|---|---|---|---|\n' +
    rows.join('\n') +
    '\n',
);
console.log(`Mapped ${rows.length} requirements`);
