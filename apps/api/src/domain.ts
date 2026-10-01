import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { uploadToS3 } from './s3';
import { Database, SQL } from './database';
export type Actor = {
  id: string;
  institution_id: string;
  role: string;
  department: string;
  student_id: string | null;
  name: string;
};
export class DomainError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const fail = (status: number, code: string, message: string): never => {
  throw new DomainError(status, code, message);
};
const escapeLike = (value: string) => value.replace(/[%_\\]/g, (c) => '\\' + c);
const text = z.string().trim().min(1).max(250),
  long = z.string().trim().min(1).max(10000),
  date = z.iso.date();
const optionalDate = z
  .preprocess((value) => (value === '' ? null : value), date.nullable())
  .optional();
const publicationFields = {
  category: z
    .enum([
      'General',
      'Admissions',
      'Academic',
      'Examinations',
      'Student services',
      'Research',
      'Recruitment',
      'Tender',
    ])
    .optional(),
  issue_date: optionalDate,
  reference: z.string().trim().max(120).optional(),
  available_on: optionalDate,
  archive_on: optionalDate,
};
function validatePublication(value: Record<string, unknown>) {
  if (
    value.archive_on &&
    value.available_on &&
    new Date(String(value.archive_on)).getTime() <= new Date(String(value.available_on)).getTime()
  )
    fail(422, 'PUBLICATION_DATES', 'Archive date must be after the first visible date.');
}
export const schemas = {
  applications: z
    .object({ name: text, email: z.email(), external_ref: text, pool_id: text, department: text })
    .strict(),
  sessions: z
    .object({
      title: text,
      department: text,
      cohort: text,
      faculty_id: text,
      competency_id: text,
      room: text,
      category: z.enum(['Theory', 'Practical', 'Posting']),
      starts_at: z.iso.datetime(),
      ends_at: z.iso.datetime(),
    })
    .strict(),
  competencies: z
    .object({ code: text, title: text, subject: text, curriculum_version: text, source: text })
    .strict(),
  assessments: z
    .object({
      title: text,
      department: text,
      cohort: text,
      competency_id: text,
      max_marks: z.number().int().min(1).max(10000),
      examiner_id: text,
      rubric: long,
    })
    .strict(),
  logbook: z
    .object({
      competency_id: text,
      supervisor_id: text,
      activity: text,
      activity_date: date,
      reflection: long,
      posting: text,
    })
    .strict(),
  invoices: z
    .object({
      student_id: text,
      description: text,
      amount_minor: z.number().int().min(1).max(1000000000),
      due_date: date,
      fee_version: text,
    })
    .strict(),
  content: z
    .object({
      slug: z.string().regex(/^[a-z0-9-]{1,80}$/),
      title: text,
      body: long,
      kind: z.enum(['Page', 'Notice', 'Event', 'Disclosure']),
      language: z.enum(['en', 'bn']),
      review_date: date,
      ...publicationFields,
    })
    .strict(),
  tickets: z
    .object({
      title: text,
      description: long,
      confidential: z.boolean(),
      severity: z.enum(['Normal', 'High', 'Urgent']),
      due_date: date,
    })
    .strict(),
  notices: z
    .object({
      title: text,
      body: long,
      audience: z.enum(['all', 'student', 'faculty', 'finance', 'registrar']),
    })
    .strict(),
  masters: z
    .object({
      kind: z.enum(['Campus', 'Department', 'Programme', 'Batch', 'Hospital']),
      code: text,
      name: text,
    })
    .strict(),
  policies: z
    .object({
      name: text,
      kind: z.enum(['Attendance', 'Academic', 'Fees']),
      effective_date: date,
      config: z.record(z.string(), z.unknown()),
    })
    .strict(),
  corrections: z
    .object({
      session_id: text,
      student_id: text,
      proposed_status: z.enum(['Present', 'Absent', 'Excused']),
      reason: long,
    })
    .strict(),
  refunds: z
    .object({ payment_id: text, amount_minor: z.number().int().positive(), reason: long })
    .strict(),
  documents: z
    .object({
      name: text,
      mime: z.enum(['application/pdf', 'image/png', 'image/jpeg']),
      content_base64: z.string().max(7000000).optional(),
      s3_key: z.string().optional(),
    })
    .strict(),
  evidence: z.object({ title: text, period: text }).strict(),
};
type Resource = keyof typeof schemas | 'students' | 'payments' | 'audit' | 'seat-pools';
const tables: Record<Resource, string> = {
  applications: 'applications',
  sessions: 'teaching_sessions',
  competencies: 'competencies',
  assessments: 'assessments',
  logbook: 'logbook',
  invoices: 'invoices',
  content: 'content',
  tickets: 'tickets',
  notices: 'notices',
  masters: 'masters',
  policies: 'policies',
  corrections: 'corrections',
  refunds: 'refunds',
  documents: 'documents',
  evidence: 'evidence',
  students: 'students',
  payments: 'payments',
  audit: 'audit',
  'seat-pools': 'seat_pools',
};
const readRoles: Record<Resource, string[]> = {
  students: ['admin', 'registrar', 'faculty', 'dean', 'student', 'finance', 'auditor'],
  applications: ['registrar', 'dean', 'admin'],
  sessions: ['admin', 'faculty', 'dean', 'student', 'registrar'],
  competencies: ['admin', 'faculty', 'dean', 'student', 'registrar'],
  assessments: ['admin', 'faculty', 'dean', 'student'],
  logbook: ['faculty', 'student', 'dean'],
  invoices: ['finance', 'student', 'dean'],
  payments: ['finance', 'dean'],
  refunds: ['finance', 'dean'],
  content: ['editor', 'publisher', 'admin'],
  tickets: [
    'admin',
    'registrar',
    'faculty',
    'student',
    'finance',
    'dean',
    'committee',
    'editor',
    'publisher',
    'auditor',
  ],
  notices: [
    'admin',
    'registrar',
    'faculty',
    'student',
    'finance',
    'dean',
    'committee',
    'editor',
    'publisher',
    'auditor',
  ],
  masters: ['admin', 'registrar', 'faculty', 'dean'],
  policies: ['admin', 'dean', 'faculty', 'registrar'],
  corrections: ['faculty', 'dean'],
  documents: [
    'admin',
    'registrar',
    'faculty',
    'student',
    'finance',
    'dean',
    'committee',
    'editor',
    'publisher',
    'auditor',
  ],
  evidence: ['admin', 'dean', 'auditor'],
  audit: ['admin', 'auditor', 'dean'],
  'seat-pools': ['registrar', 'dean', 'admin'],
};
const writeRoles: Record<string, string[]> = {
  applications: ['registrar'],
  sessions: ['admin', 'faculty'],
  competencies: ['admin', 'faculty'],
  assessments: ['faculty'],
  logbook: ['student'],
  invoices: ['finance'],
  content: ['editor'],
  tickets: readRoles.tickets,
  notices: ['admin', 'dean'],
  masters: ['admin'],
  policies: ['admin'],
  corrections: ['faculty'],
  refunds: ['finance'],
  documents: readRoles.documents,
  evidence: ['admin', 'dean', 'auditor'],
};
function authorize(a: Actor, roles: string[]) {
  if (!roles.includes(a.role))
    fail(403, 'FORBIDDEN', 'Your current role cannot perform this action.');
}
function parse<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success)
    fail(
      422,
      'VALIDATION',
      result.error.issues.map((e) => `${e.path.join('.') || 'Request'}: ${e.message}`).join('; '),
    );
  return result.data as z.infer<T>;
}
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export class Domain {
  constructor(public db: Database) {}
  async audit(tx: SQL, a: Actor, action: string, id: string, reason?: string, previous?: unknown) {
    const restricted =
      typeof previous === 'object' &&
      previous !== null &&
      'confidential' in previous &&
      previous.confidential === true;
    await tx.query(
      'INSERT INTO audit(id,institution_id,actor_id,action,entity_id,reason,previous,correlation_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [
        randomUUID(),
        a.institution_id,
        a.id,
        action,
        id,
        restricted
          ? 'Confidential review note retained with the restricted record.'
          : reason || null,
        previous ? JSON.stringify(previous) : null,
        randomUUID(),
      ],
    );
  }
  async emit(tx: SQL, a: Actor, event: string, id: string) {
    await tx.query(
      'INSERT INTO outbox(id,institution_id,event_type,entity_id) VALUES ($1,$2,$3,$4)',
      [randomUUID(), a.institution_id, event, id],
    );
  }
  scope(resource: Resource, a: Actor, args: unknown[]) {
    let clause = 'institution_id=$1';
    if (a.role === 'student') {
      if (resource === 'students') {
        args.push(a.student_id);
        clause += ` AND id=$${args.length}`;
      }
      if (['invoices', 'logbook'].includes(resource)) {
        args.push(a.student_id);
        clause += ` AND student_id=$${args.length}`;
      }
      if (['sessions', 'assessments'].includes(resource)) {
        args.push(a.student_id);
        clause += ` AND cohort=(SELECT batch FROM students WHERE id=$${args.length} AND institution_id=$1)`;
        if (resource === 'assessments') clause += " AND status='Published'";
      }
    }
    if (a.role === 'faculty') {
      if (resource === 'students') {
        args.push(a.department);
        clause += ` AND department=$${args.length}`;
      }
      if (resource === 'sessions') {
        args.push(a.id);
        clause += ` AND faculty_id=$${args.length}`;
      }
      if (resource === 'assessments') {
        args.push(a.id);
        clause += ` AND examiner_id=$${args.length}`;
      }
      if (resource === 'logbook') {
        args.push(a.id);
        clause += ` AND supervisor_id=$${args.length}`;
      }
      if (resource === 'corrections') {
        args.push(a.id);
        clause += ` AND requester_id=$${args.length}`;
      }
    }
    if (resource === 'documents') {
      args.push(a.id);
      clause += ` AND owner_id=$${args.length}`;
    }
    if (resource === 'tickets') {
      args.push(a.id);
      const p = `$${args.length}`;
      clause +=
        a.role === 'committee'
          ? ` AND (confidential=true OR requester_id=${p})`
          : ['admin', 'registrar'].includes(a.role)
            ? ` AND (confidential=false OR requester_id=${p})`
            : ` AND requester_id=${p}`;
    }
    if (resource === 'notices') {
      args.push(a.role);
      clause += ` AND (audience='all' OR audience=$${args.length})`;
    }
    return clause;
  }
  resource(value: string): Resource {
    if (!Object.hasOwn(tables, value)) fail(404, 'NOT_FOUND', 'This module is unavailable.');
    return value as Resource;
  }
  async list(
    name: string,
    a: Actor,
    query: { q?: string; status?: string; page?: string; limit?: string } = {},
  ) {
    const resource = this.resource(name);
    authorize(a, readRoles[resource]);
    const args: unknown[] = [a.institution_id];
    let where = this.scope(resource, a, args);
    const searchColumn = ['students', 'applications', 'masters', 'policies', 'documents'].includes(
      resource,
    )
      ? 'name'
      : [
            'sessions',
            'assessments',
            'content',
            'tickets',
            'notices',
            'evidence',
            'competencies',
          ].includes(resource)
        ? 'title'
        : resource === 'logbook'
          ? 'activity'
          : resource === 'invoices'
            ? 'description'
            : null;
    if (query.q && searchColumn) {
      args.push(`%${escapeLike(query.q.slice(0, 150))}%`);
      where += ` AND ${searchColumn} ILIKE $${args.length}`;
    }
    const hasStatus = [
      'students',
      'applications',
      'sessions',
      'assessments',
      'logbook',
      'invoices',
      'content',
      'tickets',
      'policies',
      'refunds',
      'corrections',
      'documents',
    ].includes(resource);
    if (query.status && hasStatus) {
      args.push(query.status);
      where += ` AND status=$${args.length}`;
    }
    const total = Number(
      (
        await this.db.query(
          `SELECT count(*) AS total FROM ${tables[resource]} WHERE ${where}`,
          args,
        )
      ).rows[0].total,
    );
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20)),
      page = Math.max(1, Math.min(100000, Number(query.page) || 1));
    const columns =
      resource === 'documents'
        ? 'id,name,mime,size,checksum,status,created_at'
        : resource === 'audit'
          ? 'id,action,entity_id,actor_id,reason,correlation_id,created_at'
          : resource === 'assessments' && a.role === 'student'
            ? 'id,title,department,cohort,max_marks,status,version,published_at'
            : resource === 'students' && a.role === 'finance'
              ? 'id,number,name,programme,batch,status'
              : '*';
    const rows = (
      await this.db.query(
        `SELECT ${columns} FROM ${tables[resource]} WHERE ${where} ORDER BY ${resource === 'sessions' ? 'starts_at' : 'id'} LIMIT $${args.length + 1} OFFSET $${args.length + 2}`,
        [...args, limit, (page - 1) * limit],
      )
    ).rows;
    return { items: rows, total, page, limit };
  }
  async get(name: string, id: string, a: Actor, tx: SQL = this.db, lock = false) {
    const resource = this.resource(name);
    authorize(a, readRoles[resource]);
    const args: unknown[] = [a.institution_id];
    const where = this.scope(resource, a, args);
    args.push(id);
    const row = (
      await tx.query(
        `SELECT * FROM ${tables[resource]} WHERE ${where} AND id=$${args.length}${lock ? ' FOR UPDATE' : ''}`,
        args,
      )
    ).rows[0];
    if (!row) fail(404, 'NOT_FOUND', 'Record not found or not accessible.');
    return row;
  }
  async detail(name: string, id: string, a: Actor) {
    const row = await this.get(name, id, a);
    if (name === 'audit') {
      delete row.previous;
      return row;
    }
    if (name === 'documents') {
      delete row.content_base64;
      return row;
    }
    if (name === 'assessments') {
      row.marks = (
        await this.db.query(
          'SELECT m.*,s.name FROM marks m JOIN students s ON s.id=m.student_id AND s.institution_id=m.institution_id WHERE m.institution_id=$1 AND m.assessment_id=$2' +
            (a.role === 'student' ? ' AND m.student_id=$3' : ''),
          a.role === 'student' ? [a.institution_id, id, a.student_id] : [a.institution_id, id],
        )
      ).rows;
      if (a.role === 'student') delete row.snapshot;
    }
    if (name === 'sessions') {
      row.register = (
        await this.db.query(
          'SELECT s.id,s.name,s.number,a.status FROM students s LEFT JOIN attendance a ON a.student_id=s.id AND a.session_id=$2 AND a.institution_id=s.institution_id WHERE s.institution_id=$1 AND s.batch=$3' +
            (a.role === 'student' ? ' AND s.id=$4' : ''),
          a.role === 'student'
            ? [a.institution_id, id, row.cohort, a.student_id]
            : [a.institution_id, id, row.cohort],
        )
      ).rows;
    }
    if (name === 'students' && a.role === 'finance')
      return {
        id: row.id,
        name: row.name,
        number: row.number,
        batch: row.batch,
        programme: row.programme,
        status: row.status,
      };
    return row;
  }
  async relation(tx: SQL, table: string, id: string, a: Actor) {
    const row = (
      await tx.query(`SELECT * FROM ${table} WHERE id=$1 AND institution_id=$2`, [
        id,
        a.institution_id,
      ])
    ).rows[0];
    if (!row) fail(422, 'RELATION', 'Referenced record is not available in this institution.');
    return row;
  }
  async insert(tx: SQL, table: string, data: Record<string, unknown>) {
    const keys = Object.keys(data);
    return (
      await tx.query(
        `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')}) RETURNING *`,
        Object.values(data),
      )
    ).rows[0];
  }
  async create(name: string, input: unknown, a: Actor) {
    const resource = this.resource(name);
    authorize(a, writeRoles[resource] || []);
    const schema = schemas[resource as keyof typeof schemas];
    if (!schema) fail(403, 'FORBIDDEN', 'Creation is not available.');
    const data: Record<string, any> = parse(schema, input);
    return this.db.transaction(async (tx) => {
      const row: Record<string, any> = {
        ...data,
        id: randomUUID(),
        institution_id: a.institution_id,
      };
      if (resource === 'applications') {
        const pool = await this.relation(tx, 'seat_pools', data.pool_id, a);
        row.programme = pool.programme;
        row.batch = pool.batch;
      }
      if (resource === 'sessions') {
        const faculty = await this.relation(tx, 'users', data.faculty_id, a);
        if (faculty.role !== 'faculty' || faculty.department !== data.department)
          fail(422, 'FACULTY', 'Select a faculty member in the session department.');
        if (a.role === 'faculty' && (data.faculty_id !== a.id || data.department !== a.department))
          fail(403, 'FORBIDDEN', 'You can schedule only your assigned department.');
        const competency = await this.relation(tx, 'competencies', data.competency_id, a);
        if (competency.subject !== data.department)
          fail(422, 'COMPETENCY', 'Competency must belong to the session department.');
        if (data.ends_at <= data.starts_at)
          fail(422, 'TIME_RANGE', 'Session end must follow its start.');
        await tx.query('SELECT id FROM institutions WHERE id=$1 FOR UPDATE', [a.institution_id]);
        const clash = (
          await tx.query(
            "SELECT id FROM teaching_sessions WHERE institution_id=$1 AND status<>'Cancelled' AND starts_at<$2 AND ends_at>$3 AND (faculty_id=$4 OR room=$5 OR cohort=$6)",
            [
              a.institution_id,
              data.ends_at,
              data.starts_at,
              data.faculty_id,
              data.room,
              data.cohort,
            ],
          )
        ).rows;
        if (clash.length)
          fail(
            409,
            'SCHEDULE_CLASH',
            'Faculty, room or cohort already has a session in this time range.',
          );
      }
      if (resource === 'competencies' && a.role === 'faculty' && data.subject !== a.department)
        fail(403, 'FORBIDDEN', 'Curriculum authoring is limited to your department.');
      if (resource === 'assessments') {
        if (data.examiner_id !== a.id || data.department !== a.department)
          fail(403, 'FORBIDDEN', 'Assign yourself within your department.');
        await this.relation(tx, 'competencies', data.competency_id, a);
        row.creator_id = a.id;
      }
      if (resource === 'logbook') {
        row.student_id = a.student_id;
        const supervisor = await this.relation(tx, 'users', data.supervisor_id, a);
        const student = await this.relation(tx, 'students', a.student_id!, a);
        if (
          supervisor.role !== 'faculty' ||
          supervisor.department !== student.department ||
          supervisor.id === a.id
        )
          fail(422, 'SUPERVISOR', 'Choose an eligible supervisor in your department.');
        await this.relation(tx, 'competencies', data.competency_id, a);
        if (data.activity_date > new Date().toISOString().slice(0, 10))
          fail(422, 'DATE', 'Activity date cannot be in the future.');
        if (
          /\b(MRN|ABHA|patient name|patient id)\s*[:#]/i.test(data.reflection + ' ' + data.activity)
        )
          fail(422, 'PATIENT_DATA', 'Remove patient identifiers from academic evidence.');
      }
      if (resource === 'invoices') await this.relation(tx, 'students', data.student_id, a);
      if (['content', 'policies', 'notices', 'evidence', 'documents'].includes(resource))
        row.owner_id = a.id;
      if (resource === 'policies') {
        if (data.kind === 'Attendance')
          parse(
            z
              .object({
                Theory: z.number().min(0).max(100),
                Practical: z.number().min(0).max(100),
                Posting: z.number().min(0).max(100),
              })
              .strict(),
            data.config,
          );
        row.config = JSON.stringify(data.config);
      }
      if (resource === 'tickets') row.requester_id = a.id;
      if (resource === 'corrections') {
        const session = await this.get('sessions', data.session_id, a, tx);
        if (session.status !== 'Finalized')
          fail(409, 'STATE', 'Only a finalized register can be corrected.');
        if (
          !(
            await tx.query(
              'SELECT 1 FROM attendance WHERE institution_id=$1 AND session_id=$2 AND student_id=$3',
              [a.institution_id, data.session_id, data.student_id],
            )
          ).rows.length
        )
          fail(422, 'REGISTER', 'Student has no attendance row in this session.');
        row.requester_id = a.id;
      }
      if (resource === 'refunds') {
        const payment = await this.get('payments', data.payment_id, a, tx, true);
        const reserved = Number(
          (
            await tx.query(
              "SELECT COALESCE(sum(amount_minor),0) AS amount FROM refunds WHERE institution_id=$1 AND payment_id=$2 AND status<>'Rejected'",
              [a.institution_id, payment.id],
            )
          ).rows[0].amount,
        );
        if (data.amount_minor > payment.amount_minor - reserved)
          fail(409, 'REFUND_BALANCE', 'Amount exceeds the unreserved refundable balance.');
        row.requester_id = a.id;
      }
      if (resource === 'documents') {
        const bytes = Buffer.from(data.content_base64, 'base64');
        if (bytes.length === 0 || bytes.length > 5242880)
          fail(422, 'FILE_SIZE', 'Choose a file up to 5 MB.');
        const valid =
          data.mime === 'application/pdf'
            ? bytes.subarray(0, 5).toString() === '%PDF-'
            : data.mime === 'image/png'
              ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
              : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
        if (!valid) fail(422, 'FILE_SIGNATURE', 'File contents do not match its declared type.');
        row.size = bytes.length;
        row.checksum = createHash('sha256').update(bytes).digest('hex');
        
        const s3Key = `${a.institution_id}/${row.id}`;
        await uploadToS3(s3Key, bytes, data.mime);
        row.s3_key = s3Key;
        delete row.content_base64;
      }
      if (resource === 'evidence') {
        const students = (
          await tx.query(
            'SELECT number,programme,batch,status FROM students WHERE institution_id=$1 ORDER BY number',
            [a.institution_id],
          )
        ).rows;
        const sessions = (
          await tx.query(
            'SELECT title,category,status,starts_at,version FROM teaching_sessions WHERE institution_id=$1 ORDER BY starts_at',
            [a.institution_id],
          )
        ).rows;
        const manifest = {
          generated_at: new Date().toISOString(),
          institution: a.institution_id,
          period: data.period,
          sources: ['students', 'teaching_sessions'],
          students,
          sessions,
        };
        row.manifest = JSON.stringify(manifest);
        row.checksum = hash(manifest);
      }
      if (resource === 'content') validatePublication(row);
      const result = await this.insert(tx, tables[resource], row);
      await this.audit(tx, a, `${resource}.created`, row.id);
      await this.emit(tx, a, `${resource}.created`, row.id);
      delete result.s3_key;
      return result;
    });
  }
  async action(name: string, id: string, action: string, input: unknown, a: Actor, key?: string) {
    const resource = this.resource(name);
    const base = parse(
      z
        .object({
          version: z.number().int().positive(),
          reason: z.string().trim().max(10000).optional(),
          data: z.unknown().optional(),
        })
        .strict(),
      input,
    );
    return this.db.transaction(async (tx) => {
      if (['enroll', 'record-payment', 'approve-refund'].includes(action)) {
        if (!key || key.length > 150) fail(422, 'IDEMPOTENCY', 'An idempotency key is required.');
        await tx.query('SELECT id FROM institutions WHERE id=$1 FOR UPDATE', [a.institution_id]);
        const prior = (
          await tx.query(
            'SELECT * FROM idempotency WHERE institution_id=$1 AND actor_id=$2 AND operation=$3 AND key=$4',
            [a.institution_id, a.id, `${resource}/${id}/${action}`, key],
          )
        ).rows[0];
        if (prior) {
          if (prior.request_hash !== hash(input))
            fail(409, 'IDEMPOTENCY_CONFLICT', 'This key was used with a different request.');
          return prior.response;
        }
      }
      const row = await this.get(resource, id, a, tx, true);
      if (row.version !== base.version)
        fail(
          409,
          'STALE_VERSION',
          'This record has changed. Close and reopen it before making another change.',
        );
      const update: Record<string, unknown> = { version: row.version + 1 };
      const reason = base.reason?.trim();
      const requireReason = () => {
        if (!reason) fail(422, 'REASON_REQUIRED', 'A reason is required.');
      };
      if (resource === 'applications') {
        if (action === 'start-review') {
          authorize(a, ['registrar']);
          if (!['Submitted', 'Clarification'].includes(row.status))
            fail(409, 'STATE', 'Application cannot enter review.');
          update.status = 'Verification';
        } else if (action === 'verify') {
          authorize(a, ['registrar']);
          if (!['Verification', 'Clarification'].includes(row.status))
            fail(409, 'STATE', 'Start document verification first.');
          const checks = parse(
            z
              .object({
                eligibility_verified: z.literal(true),
                allotment_verified: z.literal(true),
                payment_verified: z.boolean(),
                waiver_reason: z.string().trim().max(1000).optional(),
              })
              .strict(),
            base.data,
          );
          if (!checks.payment_verified && !checks.waiver_reason)
            fail(422, 'PAYMENT', 'Record verified payment or an authorized waiver reason.');
          Object.assign(update, checks, { status: 'Verified', verifier_id: a.id });
        } else if (action === 'clarify') {
          authorize(a, ['registrar']);
          requireReason();
          if (!['Verification', 'Submitted', 'Verified'].includes(row.status))
            fail(409, 'STATE', 'Application cannot be returned.');
          update.status = 'Clarification';
          update.reason = reason;
        } else if (action === 'approve') {
          authorize(a, ['dean']);
          if (row.status !== 'Verified')
            fail(409, 'STATE', 'Verification is required before approval.');
          if (row.verifier_id === a.id)
            fail(403, 'SELF_APPROVAL', 'Verifier cannot approve the same admission.');
          update.status = 'Approved';
          update.approver_id = a.id;
        } else if (action === 'enroll') {
          authorize(a, ['registrar']);
          if (
            row.status !== 'Approved' ||
            !row.eligibility_verified ||
            !row.allotment_verified ||
            (!row.payment_verified && !row.waiver_reason)
          )
            fail(
              409,
              'ADMISSION_GUARD',
              'Approved verification and payment or waiver are required.',
            );
          const seat = await tx.query(
            'UPDATE seat_pools SET occupied=occupied+1 WHERE institution_id=$1 AND id=$2 AND occupied<capacity RETURNING id',
            [a.institution_id, row.pool_id],
          );
          if (!seat.rows.length)
            fail(409, 'CAPACITY', 'There are no seats remaining in this pool.');
          const studentId = randomUUID();
          await this.insert(tx, 'students', {
            id: studentId,
            institution_id: a.institution_id,
            number: `MED/${new Date().getFullYear()}/${studentId.slice(0, 8).toUpperCase()}`,
            name: row.name,
            email: row.email,
            programme: row.programme,
            batch: row.batch,
            department: row.department,
          });
          update.status = 'Enrolled';
          update.student_id = studentId;
        } else fail(422, 'ACTION', 'Unknown admission action.');
      } else if (resource === 'sessions') {
        authorize(a, ['faculty']);
        if (row.faculty_id !== a.id)
          fail(403, 'ASSIGNMENT', 'Only assigned faculty can manage this register.');
        if (action === 'conduct') {
          if (row.status !== 'Planned')
            fail(409, 'STATE', 'Only planned sessions can be conducted.');
          if (new Date(row.starts_at) > new Date())
            fail(409, 'TIME', 'Cannot conduct a future session.');
          update.status = 'Conducted';
        } else if (action === 'cancel') {
          requireReason();
          if (row.status === 'Finalized')
            fail(409, 'LOCKED', 'A finalized register requires an amendment.');
          update.status = 'Cancelled';
        } else if (action === 'save-register' || action === 'finalize') {
          if (row.status !== 'Conducted')
            fail(409, 'LOCKED', 'Only a conducted, unlocked session accepts attendance.');
          const register = parse(
            z
              .array(
                z
                  .object({ student_id: text, status: z.enum(['Present', 'Absent', 'Excused']) })
                  .strict(),
              )
              .min(1)
              .max(1000),
            base.data,
          );
          if (new Set(register.map((x) => x.student_id)).size !== register.length)
            fail(422, 'DUPLICATE', 'Duplicate student in register.');
          const roster = (
            await tx.query(
              "SELECT id FROM students WHERE institution_id=$1 AND batch=$2 AND status='Active'",
              [a.institution_id, row.cohort],
            )
          ).rows;
          if (action === 'finalize' && register.length !== roster.length)
            fail(
              422,
              'INCOMPLETE',
              'Every student needs an attendance status before finalization.',
            );
          for (const entry of register) {
            if (!roster.some((s) => s.id === entry.student_id))
              fail(422, 'COHORT', 'Student is not in this cohort.');
            await tx.query(
              'INSERT INTO attendance(institution_id,session_id,student_id,status) VALUES ($1,$2,$3,$4) ON CONFLICT(session_id,student_id) DO UPDATE SET status=excluded.status',
              [a.institution_id, id, entry.student_id, entry.status],
            );
          }
          if (action === 'finalize') update.status = 'Finalized';
        } else fail(422, 'ACTION', 'Unknown attendance action.');
      } else if (resource === 'corrections') {
        authorize(a, ['dean']);
        if (action !== 'approve' || row.status !== 'Pending')
          fail(409, 'STATE', 'Correction is not pending approval.');
        if (row.requester_id === a.id)
          fail(403, 'SELF_APPROVAL', 'Requester cannot approve their correction.');
        requireReason();
        await tx.query(
          'UPDATE attendance SET status=$1 WHERE institution_id=$2 AND session_id=$3 AND student_id=$4',
          [row.proposed_status, a.institution_id, row.session_id, row.student_id],
        );
        update.status = 'Approved';
        update.approver_id = a.id;
      } else if (resource === 'logbook') {
        if (action === 'resubmit') {
          authorize(a, ['student']);
          if (row.status !== 'Returned')
            fail(409, 'STATE', 'Only returned entries can be resubmitted.');
          const d = parse(z.object({ reflection: long }).strict(), base.data);
          if (/\b(MRN|ABHA|patient name|patient id)\s*[:#]/i.test(d.reflection))
            fail(422, 'PATIENT_DATA', 'Remove patient identifiers.');
          update.reflection = d.reflection;
          update.status = 'Submitted';
        } else {
          authorize(a, ['faculty']);
          const student = await this.relation(tx, 'students', row.student_id, a);
          if (
            row.supervisor_id !== a.id ||
            a.student_id === row.student_id ||
            student.email === (await this.relation(tx, 'users', a.id, a)).email
          )
            fail(403, 'SELF_APPROVAL', 'Only the assigned independent supervisor can review.');
          if (row.status !== 'Submitted')
            fail(409, 'STATE', 'Only submitted evidence can be reviewed.');
          if (!['verify', 'return', 'reject'].includes(action))
            fail(422, 'ACTION', 'Invalid review action.');
          requireReason();
          update.status =
            action === 'verify' ? 'Verified' : action === 'return' ? 'Returned' : 'Rejected';
          update.review_note = reason;
          update.reviewed_by = a.id;
        }
      } else if (resource === 'assessments') {
        if (action === 'save-marks') {
          authorize(a, ['faculty']);
          if (row.examiner_id !== a.id || row.status !== 'Draft')
            fail(409, 'LOCKED', 'Only the assigned examiner can edit draft marks.');
          const entries = parse(
            z
              .array(
                z
                  .object({
                    student_id: text,
                    state: z.enum(['Scored', 'Absent', 'Withheld', 'Not assessed']),
                    score: z.number().int().min(0).nullable(),
                  })
                  .strict(),
              )
              .min(1)
              .max(1000),
            base.data,
          );
          for (const entry of entries) {
            const student = await this.relation(tx, 'students', entry.student_id, a);
            if (student.batch !== row.cohort)
              fail(422, 'COHORT', 'Student is outside assessment cohort.');
            if (
              (entry.state === 'Scored' && (entry.score === null || entry.score > row.max_marks)) ||
              (entry.state !== 'Scored' && entry.score !== null)
            )
              fail(
                422,
                'MARKS',
                'Scores must be within the maximum; absent/withheld are not zero.',
              );
            await tx.query(
              'INSERT INTO marks(institution_id,assessment_id,student_id,score,state,entered_by) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(assessment_id,student_id) DO UPDATE SET score=excluded.score,state=excluded.state,entered_by=excluded.entered_by',
              [a.institution_id, id, entry.student_id, entry.score, entry.state, a.id],
            );
          }
        } else if (action === 'submit') {
          authorize(a, ['faculty']);
          if (row.status !== 'Draft' || row.examiner_id !== a.id)
            fail(409, 'STATE', 'Assessment is not an editable draft.');
          const missing = (
            await tx.query(
              'SELECT s.id FROM students s WHERE s.institution_id=$1 AND s.batch=$2 AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.assessment_id=$3 AND m.student_id=s.id)',
              [a.institution_id, row.cohort, id],
            )
          ).rows;
          if (missing.length)
            fail(422, 'INCOMPLETE', 'Enter a score or explicit state for every student.');
          update.status = 'Entry locked';
        } else if (action === 'moderate') {
          authorize(a, ['dean']);
          if (row.status !== 'Entry locked' || row.examiner_id === a.id)
            fail(409, 'STATE', 'Independent moderation of locked marks is required.');
          requireReason();
          update.status = 'Moderated';
          update.moderator_id = a.id;
        } else if (action === 'publish') {
          authorize(a, ['dean']);
          if (row.status !== 'Moderated' || row.examiner_id === a.id)
            fail(403, 'PUBLICATION', 'Only independently moderated results can be published.');
          if (
            (
              await tx.query('SELECT 1 FROM marks WHERE assessment_id=$1 AND entered_by=$2', [
                id,
                a.id,
              ])
            ).rows.length
          )
            fail(403, 'SELF_APPROVAL', 'Marks entry and publication must be independent.');
          update.snapshot = JSON.stringify({
            rubric: row.rubric,
            max_marks: row.max_marks,
            version: row.version,
            marks: (
              await tx.query('SELECT student_id,score,state FROM marks WHERE assessment_id=$1', [
                id,
              ])
            ).rows,
          });
          update.status = 'Published';
          update.publisher_id = a.id;
          update.published_at = new Date().toISOString();
        } else if (action === 'revoke') {
          authorize(a, ['dean']);
          requireReason();
          if (row.status !== 'Published') fail(409, 'STATE', 'Result is not published.');
          update.status = 'Revoked';
        } else fail(422, 'ACTION', 'Unknown assessment action.');
      } else if (resource === 'invoices' && action === 'record-payment') {
        authorize(a, ['finance']);
        const payment = parse(
          z
            .object({
              amount_minor: z.number().int().positive(),
              reference: text,
              method: z.enum(['Bank transfer', 'Cash']),
            })
            .strict(),
          base.data,
        );
        if (payment.amount_minor > row.amount_minor - row.paid_minor)
          fail(409, 'OVERPAYMENT', 'Payment exceeds the outstanding balance.');
        await this.insert(tx, 'payments', {
          id: randomUUID(),
          institution_id: a.institution_id,
          invoice_id: id,
          ...payment,
          actor_id: a.id,
        });
        update.paid_minor = row.paid_minor + payment.amount_minor;
        update.status = update.paid_minor === row.amount_minor ? 'Paid' : 'Partial';
      } else if (resource === 'refunds') {
        if (action === 'approve-refund') {
          authorize(a, ['dean']);
          if (row.requester_id === a.id)
            fail(403, 'SELF_APPROVAL', 'Refund maker cannot approve their own request.');
          if (row.status !== 'Pending approval')
            fail(409, 'STATE', 'Refund is not pending approval.');
          update.status = 'Approved · awaiting completion';
          update.approver_id = a.id;
        } else if (action === 'complete') {
          authorize(a, ['finance']);
          requireReason();
          if (row.status !== 'Approved · awaiting completion')
            fail(409, 'STATE', 'Refund needs independent approval.');
          const payment = await this.relation(tx, 'payments', row.payment_id, a);
          await tx.query(
            "UPDATE invoices SET paid_minor=paid_minor-$1,status='Refunded / balance due',version=version+1 WHERE id=$2 AND institution_id=$3",
            [row.amount_minor, payment.invoice_id, a.institution_id],
          );
          update.status = 'Completed';
        } else fail(422, 'ACTION', 'Unknown refund action.');
      } else if (resource === 'content') {
        if (action === 'edit') {
          authorize(a, ['editor']);
          if (row.owner_id !== a.id || !['Draft', 'Returned'].includes(row.status))
            fail(403, 'LOCKED', 'Only your draft or returned content can be edited.');
          Object.assign(
            update,
            parse(
              z
                .object({ title: text, body: long, review_date: date, ...publicationFields })
                .strict(),
              base.data,
            ),
          );
        } else if (action === 'submit') {
          authorize(a, ['editor']);
          if (row.owner_id !== a.id || !['Draft', 'Returned'].includes(row.status))
            fail(409, 'STATE', 'Submit an owned draft.');
          update.status = 'In review';
        } else if (action === 'publish') {
          authorize(a, ['publisher']);
          if (row.owner_id === a.id)
            fail(403, 'SELF_APPROVAL', 'Author cannot publish their own content.');
          if (row.status !== 'In review') fail(409, 'STATE', 'Content needs editorial review.');
          update.status = 'Published';
          update.published_body = row.body;
          update.published_title = row.title;
          update.published_at = new Date().toISOString();
          update.published_metadata = JSON.stringify({
            category: row.category,
            issue_date: row.issue_date,
            reference: row.reference,
            available_on: row.available_on,
            archive_on: row.archive_on,
            review_date: row.review_date,
          });
          update.reviewer_id = a.id;
        } else if (action === 'return') {
          authorize(a, ['publisher']);
          requireReason();
          if (row.status !== 'In review') fail(409, 'STATE', 'Content is not in review.');
          update.status = 'Returned';
        } else if (action === 'archive') {
          authorize(a, ['publisher']);
          requireReason();
          update.status = 'Archived';
        } else if (action === 'revise') {
          authorize(a, ['editor']);
          if (row.owner_id !== a.id || row.status !== 'Published')
            fail(409, 'STATE', 'Create a revision from your published page.');
          update.status = 'Draft';
        } else fail(422, 'ACTION', 'Unknown editorial action.');
      } else if (resource === 'tickets') {
        if (row.confidential) authorize(a, ['committee']);
        else authorize(a, ['admin', 'registrar']);
        if (action === 'resolve') {
          requireReason();
          update.status = 'Resolved';
          update.resolution = reason;
        } else if (action === 'assign') {
          const d = parse(z.object({ assigned_to: text }).strict(), base.data);
          const target = await this.relation(tx, 'users', d.assigned_to, a);
          if (row.confidential && target.role !== 'committee')
            fail(
              403,
              'CONFIDENTIAL',
              'Assign confidential matters only to the designated committee.',
            );
          update.assigned_to = d.assigned_to;
          update.status = 'In progress';
        } else fail(422, 'ACTION', 'Unknown support action.');
      } else if (resource === 'policies' && action === 'approve') {
        authorize(a, ['dean']);
        if (row.owner_id === a.id)
          fail(403, 'SELF_APPROVAL', 'Policy author cannot approve their policy.');
        if (row.status !== 'Draft') fail(409, 'STATE', 'Policy is not a draft.');
        if (row.kind === 'Attendance')
          parse(
            z
              .object({
                Theory: z.number().min(0).max(100),
                Practical: z.number().min(0).max(100),
                Posting: z.number().min(0).max(100),
              })
              .strict(),
            row.config,
          );
        requireReason();
        update.status = 'Approved';
        update.approver_id = a.id;
      } else fail(422, 'ACTION', 'This action is unavailable for this record.');
      if (resource === 'content') validatePublication({ ...row, ...update });
      const keys = Object.keys(update);
      const result = (
        await tx.query(
          `UPDATE ${tables[resource]} SET ${keys.map((k, i) => `${k}=$${i + 1}`).join(',')} WHERE id=$${keys.length + 1} AND institution_id=$${keys.length + 2} RETURNING *`,
          [...Object.values(update), id, a.institution_id],
        )
      ).rows[0];
      await this.audit(tx, a, `${resource}.${action}`, id, reason, row);
      await this.emit(tx, a, `${resource}.${action}`, id);
      if (key && ['enroll', 'record-payment', 'approve-refund'].includes(action))
        await tx.query('INSERT INTO idempotency VALUES ($1,$2,$3,$4,$5,$6)', [
          a.institution_id,
          a.id,
          `${resource}/${id}/${action}`,
          key,
          hash(input),
          JSON.stringify(result),
        ]);
      return result;
    });
  }
  async attendanceSummary(a: Actor, id?: string) {
    authorize(a, ['student', 'faculty', 'dean', 'registrar', 'admin', 'auditor']);
    const student = await this.get('students', id || a.student_id || '', a);
    const rows = (
      await this.db.query(
        "SELECT t.category,t.status,a.status AS attendance FROM teaching_sessions t LEFT JOIN attendance a ON a.session_id=t.id AND a.student_id=$2 WHERE t.institution_id=$1 AND t.cohort=$3 AND t.status<>'Cancelled'",
        [a.institution_id, student.id, student.batch],
      )
    ).rows;
    const policy = (
      await this.db.query(
        "SELECT id,version,config FROM policies WHERE institution_id=$1 AND kind='Attendance' AND status='Approved' AND effective_date<=CURRENT_DATE ORDER BY effective_date DESC,version DESC LIMIT 1",
        [a.institution_id],
      )
    ).rows[0];
    return {
      student_id: student.id,
      policy: policy ? { id: policy.id, version: policy.version } : null,
      categories: ['Theory', 'Practical', 'Posting'].map((category) => {
        const group = rows.filter((r) => r.category === category);
        const finalized = group.filter((r) => r.status === 'Finalized' && r.attendance);
        const present = finalized.filter((r) => r.attendance === 'Present').length;
        const percent = finalized.length
          ? Math.round((present / finalized.length) * 1000) / 10
          : null;
        const provisional =
          group.some(
            (r) => r.status !== 'Finalized' || !r.attendance || r.attendance === 'Excused',
          ) ||
          !policy ||
          !finalized.length;
        return {
          category,
          present,
          total: finalized.length,
          percent,
          status: provisional
            ? 'Provisional'
            : percent! >= Number(policy.config[category])
              ? 'Eligible'
              : 'Shortage',
        };
      }),
    };
  }
  async dashboard(a: Actor) {
    const count = async (name: string, status?: string) => {
      try {
        return (await this.list(name, a, { limit: '1', status })).total;
      } catch (error) {
        if (error instanceof DomainError && error.status === 403) return null;
        throw error;
      }
    };
    return {
      generated_at: new Date().toISOString(),
      students: await count('students'),
      applications: await count('applications', 'Submitted'),
      sessions: await count('sessions'),
      pending_logbook: await count('logbook', 'Submitted'),
      invoices: await count('invoices', 'Due'),
      tickets: await count('tickets', 'Open'),
      notices: (await this.list('notices', a, { limit: '4' })).items,
      formula:
        'Counts of authorized records in current institution; pending items use the displayed status filter.',
      environment: 'Synthetic development data',
      integrations: {
        payments: 'Not connected',
        hmis: 'Release 2 · disabled',
        messaging: 'Not connected',
        scanner: 'Not connected',
      },
    };
  }
  async options(a: Actor) {
    return {
      people: (
        await this.db.query(
          "SELECT id,name,role,department FROM users WHERE institution_id=$1 AND role IN ('faculty','committee','registrar','admin') AND active=true",
          [a.institution_id],
        )
      ).rows,
      competencies: (
        await this.db.query(
          'SELECT id,code,title,subject FROM competencies WHERE institution_id=$1 ORDER BY code',
          [a.institution_id],
        )
      ).rows,
      departments: (
        await this.db.query(
          "SELECT code,name FROM masters WHERE institution_id=$1 AND kind='Department' AND retired=false ORDER BY name",
          [a.institution_id],
        )
      ).rows,
      batches: (
        await this.db.query(
          "SELECT code,name FROM masters WHERE institution_id=$1 AND kind='Batch' AND retired=false ORDER BY name",
          [a.institution_id],
        )
      ).rows,
      pools: ['registrar', 'admin', 'dean'].includes(a.role)
        ? (
            await this.db.query('SELECT * FROM seat_pools WHERE institution_id=$1', [
              a.institution_id,
            ])
          ).rows
        : [],
      students: ['faculty', 'finance', 'dean'].includes(a.role)
        ? (await this.list('students', a, { limit: '100' })).items
        : [],
    };
  }
  async publicContent(slug?: string, language = 'en', search = '') {
    const rows = (
      await this.db.query(
        `SELECT slug,published_title AS title,published_body AS body,language,kind,published_at,COALESCE(published_metadata->>'review_date',review_date::text) AS review_date,published_metadata AS metadata,
          CASE WHEN (published_metadata->>'archive_on')::date <= (now() AT TIME ZONE 'Asia/Kolkata')::date THEN 'Archived' ELSE 'Current' END AS notice_state
         FROM content WHERE institution_id='demo' AND published_at IS NOT NULL AND status<>'Archived' AND language=$1
         AND ((published_metadata->>'available_on') IS NULL OR (published_metadata->>'available_on')::date <= (now() AT TIME ZONE 'Asia/Kolkata')::date)
         AND ($2::text IS NULL OR slug=$2) AND (published_title ILIKE $3 OR published_body ILIKE $3) ORDER BY slug`,
        [language, slug || null, `%${escapeLike(search.slice(0, 150))}%`],
      )
    ).rows;
    return rows;
  }
}
