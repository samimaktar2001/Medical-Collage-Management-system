export type Field = {
  key: string;
  label: string;
  type?: string;
  options?: string[];
  source?: string;
  wide?: boolean;
  optional?: boolean;
  value?: string;
};
export const fields: Record<string, Field[]> = {
  applications: [
    { key: 'name', label: 'Candidate name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'external_ref', label: 'External allotment reference' },
    { key: 'pool_id', label: 'Seat pool', source: 'pools' },
    { key: 'department', label: 'Department', source: 'departments' },
  ],
  sessions: [
    { key: 'title', label: 'Session title', wide: true },
    { key: 'department', label: 'Department', source: 'departments' },
    { key: 'cohort', label: 'Cohort', source: 'batches' },
    { key: 'faculty_id', label: 'Assigned faculty', source: 'people' },
    { key: 'competency_id', label: 'Competency', source: 'competencies' },
    { key: 'room', label: 'Room / location' },
    { key: 'category', label: 'Teaching category', options: ['Theory', 'Practical', 'Posting'] },
    { key: 'starts_at', label: 'Starts (your local time)', type: 'datetime-local' },
    { key: 'ends_at', label: 'Ends (your local time)', type: 'datetime-local' },
  ],
  competencies: [
    { key: 'code', label: 'Competency code' },
    { key: 'title', label: 'Description', wide: true },
    { key: 'subject', label: 'Department', source: 'departments' },
    { key: 'curriculum_version', label: 'Curriculum version' },
    { key: 'source', label: 'Approved source reference', wide: true },
  ],
  assessments: [
    { key: 'title', label: 'Assessment title', wide: true },
    { key: 'department', label: 'Department', source: 'departments' },
    { key: 'cohort', label: 'Cohort', source: 'batches' },
    { key: 'competency_id', label: 'Competency', source: 'competencies' },
    { key: 'max_marks', label: 'Maximum marks', type: 'number' },
    { key: 'examiner_id', label: 'Examiner', source: 'people' },
    { key: 'rubric', label: 'Rubric and component breakdown', type: 'textarea', wide: true },
  ],
  logbook: [
    { key: 'activity', label: 'Learning activity', wide: true },
    { key: 'competency_id', label: 'Competency', source: 'competencies' },
    { key: 'supervisor_id', label: 'Supervisor', source: 'people' },
    { key: 'activity_date', label: 'Activity date', type: 'date' },
    { key: 'posting', label: 'Posting / teaching location' },
    {
      key: 'reflection',
      label: 'Reflection (no patient identifiers)',
      type: 'textarea',
      wide: true,
    },
  ],
  invoices: [
    { key: 'student_id', label: 'Student', source: 'students' },
    { key: 'description', label: 'Fee description' },
    { key: 'amount_minor', label: 'Amount in paise (₹1 = 100 paise)', type: 'number' },
    { key: 'due_date', label: 'Due date', type: 'date' },
    { key: 'fee_version', label: 'Approved fee schedule version' },
  ],
  content: [
    { key: 'title', label: 'Title', wide: true },
    { key: 'slug', label: 'URL slug (lowercase letters, numbers, hyphens)' },
    { key: 'kind', label: 'Content type', options: ['Page', 'Notice', 'Event', 'Disclosure'] },
    { key: 'language', label: 'Language', options: ['en', 'bn'] },
    { key: 'review_date', label: 'Next review date', type: 'date' },
    {
      key: 'category',
      label: 'Publication category',
      options: [
        'General',
        'Admissions',
        'Academic',
        'Examinations',
        'Student services',
        'Research',
        'Recruitment',
        'Tender',
      ],
    },
    { key: 'issue_date', label: 'Issue date', type: 'date', optional: true },
    { key: 'reference', label: 'Notice reference', optional: true },
    {
      key: 'available_on',
      label: 'Visible from (IST date, inclusive)',
      type: 'date',
      optional: true,
    },
    {
      key: 'archive_on',
      label: 'Archive from (IST date, inclusive)',
      type: 'date',
      optional: true,
    },
    {
      key: 'body',
      label: 'Content (plain text; use ## for section headings and - for list items)',
      type: 'textarea',
      wide: true,
    },
  ],
  tickets: [
    { key: 'title', label: 'Subject', wide: true },
    { key: 'description', label: 'Describe your request', type: 'textarea', wide: true },
    { key: 'severity', label: 'Priority', options: ['Normal', 'High', 'Urgent'] },
    { key: 'due_date', label: 'Requested response date', type: 'date' },
    {
      key: 'confidential',
      label: 'Confidential concern / anti-ragging',
      type: 'checkbox',
      wide: true,
    },
  ],
  notices: [
    { key: 'title', label: 'Notice title', wide: true },
    { key: 'body', label: 'Message', type: 'textarea', wide: true },
    {
      key: 'audience',
      label: 'Audience',
      options: ['all', 'student', 'faculty', 'finance', 'registrar'],
    },
  ],
  masters: [
    {
      key: 'kind',
      label: 'Type',
      options: ['Campus', 'Department', 'Programme', 'Batch', 'Hospital'],
    },
    { key: 'code', label: 'Unique code' },
    { key: 'name', label: 'Name', wide: true },
  ],
  policies: [
    { key: 'name', label: 'Policy name', wide: true },
    { key: 'kind', label: 'Policy type', options: ['Attendance', 'Academic', 'Fees'] },
    { key: 'effective_date', label: 'Effective date', type: 'date' },
    {
      key: 'config',
      label: 'Configuration (JSON; Attendance requires Theory, Practical, Posting percentages)',
      type: 'textarea',
      wide: true,
    },
  ],
  corrections: [
    { key: 'session_id', label: 'Finalized session ID' },
    { key: 'student_id', label: 'Student', source: 'students' },
    {
      key: 'proposed_status',
      label: 'Corrected attendance',
      options: ['Present', 'Absent', 'Excused'],
    },
    { key: 'reason', label: 'Reason and supporting reference', type: 'textarea', wide: true },
  ],
  refunds: [
    { key: 'payment_id', label: 'Payment ID (from payment ledger)' },
    { key: 'amount_minor', label: 'Refund amount in paise', type: 'number' },
    { key: 'reason', label: 'Reason', type: 'textarea', wide: true },
  ],
  evidence: [
    { key: 'title', label: 'Evidence pack title', wide: true },
    { key: 'period', label: 'Reporting period' },
  ],
  documents: [{ key: 'file', label: 'PDF, PNG or JPEG · up to 5 MB', type: 'file', wide: true }],
};
export const createRoles: Record<string, string[]> = {
  applications: ['registrar'],
  sessions: ['admin', 'faculty'],
  competencies: ['admin', 'faculty'],
  assessments: ['faculty'],
  logbook: ['student'],
  invoices: ['finance'],
  content: ['editor'],
  tickets: ['all'],
  notices: ['admin', 'dean'],
  masters: ['admin'],
  policies: ['admin'],
  corrections: ['faculty'],
  refunds: ['finance'],
  documents: ['all'],
  evidence: ['admin', 'dean', 'auditor'],
};
export const columns: Record<string, [string, string][]> = {
  applications: [
    ['name', 'Candidate'],
    ['external_ref', 'Allotment reference'],
    ['programme', 'Programme'],
    ['status', 'Stage'],
  ],
  students: [
    ['name', 'Student'],
    ['number', 'Student ID'],
    ['programme', 'Programme'],
    ['batch', 'Batch'],
    ['status', 'Status'],
  ],
  sessions: [
    ['title', 'Session'],
    ['starts_at', 'Date & time'],
    ['room', 'Location'],
    ['category', 'Category'],
    ['status', 'Register'],
  ],
  competencies: [
    ['code', 'Code'],
    ['title', 'Competency'],
    ['subject', 'Department'],
    ['curriculum_version', 'Version'],
  ],
  assessments: [
    ['title', 'Assessment'],
    ['cohort', 'Cohort'],
    ['max_marks', 'Maximum'],
    ['status', 'Stage'],
  ],
  logbook: [
    ['activity', 'Activity'],
    ['student_id', 'Learner'],
    ['activity_date', 'Activity date'],
    ['status', 'Review'],
  ],
  invoices: [
    ['description', 'Invoice'],
    ['student_id', 'Student'],
    ['amount_minor', 'Amount'],
    ['paid_minor', 'Received'],
    ['status', 'Status'],
  ],
  payments: [
    ['reference', 'Reference'],
    ['invoice_id', 'Invoice'],
    ['amount_minor', 'Received'],
    ['method', 'Method'],
  ],
  refunds: [
    ['payment_id', 'Payment'],
    ['amount_minor', 'Refund amount'],
    ['reason', 'Reason'],
    ['status', 'Stage'],
  ],
  content: [
    ['title', 'Content'],
    ['kind', 'Type'],
    ['language', 'Language'],
    ['review_date', 'Review due'],
    ['status', 'Stage'],
  ],
  tickets: [
    ['title', 'Request'],
    ['severity', 'Priority'],
    ['due_date', 'Due date'],
    ['confidential', 'Visibility'],
    ['status', 'Status'],
  ],
  notices: [
    ['title', 'Notice'],
    ['audience', 'Audience'],
    ['created_at', 'Published'],
  ],
  documents: [
    ['name', 'Document'],
    ['mime', 'Type'],
    ['size', 'Bytes'],
    ['status', 'Scan status'],
  ],
  evidence: [
    ['title', 'Evidence pack'],
    ['period', 'Period'],
    ['created_at', 'Frozen'],
  ],
  audit: [
    ['action', 'Action'],
    ['actor_id', 'Actor'],
    ['entity_id', 'Record'],
    ['created_at', 'Time'],
  ],
  masters: [
    ['name', 'Name'],
    ['kind', 'Type'],
    ['code', 'Code'],
    ['retired', 'Retired'],
  ],
  policies: [
    ['name', 'Policy'],
    ['kind', 'Type'],
    ['effective_date', 'Effective'],
    ['status', 'Stage'],
  ],
  corrections: [
    ['session_id', 'Session'],
    ['student_id', 'Student'],
    ['proposed_status', 'Correction'],
    ['status', 'Stage'],
  ],
};
export const descriptions: Record<string, string> = {
  applications: 'From verified allotment to an approved student enrolment.',
  students: 'One institutional identity. A complete academic journey.',
  sessions: 'Plan teaching, capture attendance and finalize registers.',
  competencies: 'Versioned learning outcomes and their source references.',
  assessments: 'Draft marks, independent moderation and controlled publication.',
  logbook: 'Learning evidence, reviewed by an assigned supervisor.',
  invoices: 'Issued fees and verified offline receipts. Gateway payments are not connected.',
  refunds: 'Separate approval and confirmed completion for every refund.',
  content: 'Owned content, editorial review and bilingual publication.',
  tickets: 'Track everyday requests and securely route confidential concerns.',
  documents: 'Private uploads stay quarantined until a trusted scanner approves them.',
  evidence: 'Freeze a reproducible academic snapshot with a checksum.',
  policies: 'Draft policies never affect live eligibility calculations.',
  corrections: 'Reasoned amendments to locked attendance registers.',
  payments: 'Persistent offline payment references and amounts.',
  notices: 'Audience-scoped updates from your college.',
  masters: 'Manage the institution’s reference catalogue.',
  audit: 'An append-only record of sensitive changes and exports.',
};
export const statuses: Record<string, string[]> = {
  applications: ['Submitted', 'Verification', 'Clarification', 'Verified', 'Approved', 'Enrolled'],
  sessions: ['Planned', 'Conducted', 'Finalized', 'Cancelled'],
  logbook: ['Submitted', 'Returned', 'Verified', 'Rejected'],
  assessments: ['Draft', 'Entry locked', 'Moderated', 'Published', 'Revoked'],
  content: ['Draft', 'In review', 'Published', 'Archived'],
  tickets: ['Open', 'In progress', 'Resolved'],
  invoices: ['Due', 'Partial', 'Paid'],
  policies: ['Draft', 'Approved'],
  documents: ['Quarantined', 'Clean'],
};

fields.learning = [
  { key: 'title', label: 'Title', wide: true },
  { key: 'kind', label: 'Type', options: ['Resource', 'Assignment'] },
  { key: 'cohort', label: 'Cohort', source: 'batches' },
  { key: 'department', label: 'Department', source: 'departments' },
  { key: 'due_date', label: 'Assignment deadline', type: 'date', optional: true },
  { key: 'body', label: 'Instructions / learning material', type: 'textarea', wide: true },
];
fields.submissions = [
  { key: 'resource_id', label: 'Assignment ID (from learning resource details)' },
  { key: 'body', label: 'Your submission', type: 'textarea', wide: true },
];
fields.requests = [
  { key: 'kind', label: 'Request type', options: ['Certificate', 'Leave', 'Appeal'] },
  { key: 'title', label: 'Subject' },
  { key: 'reason', label: 'Reason and relevant academic reference', type: 'textarea', wide: true },
];
Object.assign(createRoles, {
  learning: ['faculty'],
  submissions: ['student'],
  requests: ['student'],
});
Object.assign(columns, {
  learning: [
    ['title', 'Title'],
    ['kind', 'Type'],
    ['cohort', 'Cohort'],
    ['due_date', 'Deadline'],
  ],
  submissions: [
    ['resource_id', 'Assignment'],
    ['student_id', 'Learner'],
    ['submitted_at', 'Submitted'],
    ['status', 'Status'],
  ],
  requests: [
    ['title', 'Request'],
    ['kind', 'Type'],
    ['created_at', 'Submitted'],
    ['status', 'Decision'],
  ],
});
Object.assign(descriptions, {
  learning: 'Cohort-scoped teaching material and assignment instructions.',
  submissions: 'Submit work to an assigned faculty member and read their feedback.',
  requests:
    'Certificate, leave and academic appeal requests. A request approval is not an issued certificate or revised result.',
});
Object.assign(statuses, {
  requests: ['Submitted', 'Approved', 'Rejected'],
  submissions: ['Submitted', 'Reviewed'],
});
