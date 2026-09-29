import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { Actor, Domain, DomainError } from './domain';
const escapeLike = (value: string) => value.replace(/[%_\\]/g, (c) => '\\' + c);
const text = z.string().trim().min(1).max(250),
  body = z.string().trim().min(1).max(10000);
const schemas = {
  learning: z
    .object({
      title: text,
      body,
      cohort: text,
      department: text,
      kind: z.enum(['Resource', 'Assignment']),
      due_date: z.iso.date().nullable(),
    })
    .strict(),
  submissions: z.object({ resource_id: text, body }).strict(),
  requests: z
    .object({ kind: z.enum(['Certificate', 'Leave', 'Appeal']), title: text, reason: body })
    .strict(),
};
const table = {
  learning: 'learning_resources',
  submissions: 'learning_submissions',
  requests: 'service_requests',
};
type Resource = keyof typeof table;
function error(code: string, message: string, status = 422): never {
  throw new DomainError(status, code, message);
}
function parse<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const r = schema.safeParse(input);
  if (!r.success) error('VALIDATION', r.error.issues.map((i) => i.message).join('; '));
  return r.data as z.infer<T>;
}
export class Learning {
  constructor(private domain: Domain) {}
  private name(name: string): Resource {
    if (!Object.hasOwn(table, name)) error('NOT_FOUND', 'Module unavailable.', 404);
    return name as Resource;
  }
  private scope(resource: Resource, a: Actor, args: unknown[]) {
    if (!['faculty', 'student', 'dean', 'registrar'].includes(a.role))
      error('FORBIDDEN', 'This role cannot access academic requests or learning material.', 403);
    let clause = 'institution_id=$1';
    if (a.role === 'student') {
      args.push(a.student_id);
      clause +=
        resource === 'learning'
          ? ` AND cohort=(SELECT batch FROM students WHERE id=$${args.length} AND institution_id=$1)`
          : ` AND student_id=$${args.length}`;
    }
    if (a.role === 'faculty') {
      args.push(a.id);
      if (resource === 'learning') clause += ` AND faculty_id=$${args.length}`;
      else if (resource === 'submissions')
        clause += ` AND resource_id IN (SELECT id FROM learning_resources WHERE faculty_id=$${args.length} AND institution_id=$1)`;
      else error('FORBIDDEN', 'Requests require the registrar or academic approver.', 403);
    }
    if (a.role === 'registrar' && resource !== 'requests')
      error('FORBIDDEN', 'Learning records are outside registrar scope.', 403);
    return clause;
  }
  async list(name: string, a: Actor, q: Record<string, string> = {}) {
    const resource = this.name(name),
      args: unknown[] = [a.institution_id];
    let where = this.scope(resource, a, args);
    if (q.q) {
      args.push(`%${escapeLike(q.q.slice(0, 150))}%`);
      where += ` AND ${resource === 'submissions' ? 'body' : 'title'} ILIKE $${args.length}`;
    }
    if (q.status && resource !== 'learning') {
      args.push(q.status);
      where += ` AND status=$${args.length}`;
    }
    const total = Number(
      (
        await this.domain.db.query(
          `SELECT count(*) AS n FROM ${table[resource]} WHERE ${where}`,
          args,
        )
      ).rows[0].n,
    );
    const page = Math.max(1, Math.min(100000, Number(q.page) || 1));
    const items = (
      await this.domain.db.query(
        `SELECT * FROM ${table[resource]} WHERE ${where} ORDER BY id LIMIT 20 OFFSET $${args.length + 1}`,
        [...args, (page - 1) * 20],
      )
    ).rows;
    return { items, total, page, limit: 20 };
  }
  async detail(name: string, id: string, a: Actor) {
    const resource = this.name(name),
      args: unknown[] = [a.institution_id];
    const where = this.scope(resource, a, args);
    args.push(id);
    const row = (
      await this.domain.db.query(
        `SELECT * FROM ${table[resource]} WHERE ${where} AND id=$${args.length}`,
        args,
      )
    ).rows[0];
    if (!row) error('NOT_FOUND', 'Record not found or not accessible.', 404);
    return row;
  }
  async create(name: string, input: unknown, a: Actor) {
    const resource = this.name(name),
      data: Record<string, any> = parse(schemas[resource], input);
    if (
      (resource === 'learning' && a.role !== 'faculty') ||
      (resource !== 'learning' && a.role !== 'student')
    )
      error('FORBIDDEN', 'Your role cannot create this record.', 403);
    return this.domain.db.transaction(async (tx) => {
      const record: Record<string, any> = {
        ...data,
        id: randomUUID(),
        institution_id: a.institution_id,
      };
      if (resource === 'learning') {
        if (data.department !== a.department)
          error('SCOPE', 'Choose your assigned department.', 403);
        record.faculty_id = a.id;
        if (data.kind === 'Assignment' && !data.due_date)
          error('DUE_DATE', 'Assignments require a due date.');
      } else {
        record.student_id = a.student_id;
        if (resource === 'submissions') {
          const material = await this.domain.relation(
              tx,
              'learning_resources',
              data.resource_id,
              a,
            ),
            student = await this.domain.relation(tx, 'students', a.student_id!, a);
          if (material.cohort !== student.batch || material.kind !== 'Assignment')
            error('SCOPE', 'This assignment is not available to you.', 403);
          if (
            new Date(material.due_date).toISOString().slice(0, 10) <
            new Date().toISOString().slice(0, 10)
          )
            error(
              'DEADLINE',
              'Submission deadline has passed. Ask your faculty to record an extension.',
              409,
            );
        }
      }
      const result = await this.domain.insert(tx, table[resource], record);
      await this.domain.audit(tx, a, `${resource}.created`, record.id);
      await this.domain.emit(tx, a, `${resource}.created`, record.id);
      return result;
    });
  }
  async action(name: string, id: string, action: string, input: unknown, a: Actor) {
    const resource = this.name(name),
      data = parse(
        z
          .object({
            version: z.number().int().positive(),
            reason: z.string().max(10000).optional(),
            data: z.unknown().optional(),
          })
          .strict(),
        input,
      );
    return this.domain.db.transaction(async (tx) => {
      const args: unknown[] = [a.institution_id];
      const where = this.scope(resource, a, args);
      args.push(id);
      const row = (
        await tx.query(
          `SELECT * FROM ${table[resource]} WHERE ${where} AND id=$${args.length} FOR UPDATE`,
          args,
        )
      ).rows[0];
      if (!row) error('NOT_FOUND', 'Record not found or not accessible.', 404);
      if (row.version !== data.version)
        error('STALE_VERSION', 'Record changed; reopen before saving.', 409);
      const update: Record<string, any> = { version: row.version + 1 };
      if (resource === 'learning' && action === 'extend') {
        if (a.role !== 'faculty' || row.faculty_id !== a.id)
          error('FORBIDDEN', 'Only assigned faculty can extend the deadline.', 403);
        const extension = parse(z.object({ due_date: z.iso.date() }).strict(), data.data);
        if (!data.reason) error('REASON', 'Record the extension reason.');
        update.due_date = extension.due_date;
      } else if (resource === 'submissions' && action === 'review') {
        if (a.role !== 'faculty')
          error('FORBIDDEN', 'Only assigned faculty reviews submissions.', 403);
        if (!data.reason) error('REASON', 'Feedback is required.');
        update.status = 'Reviewed';
        update.feedback = data.reason;
      } else if (resource === 'requests' && ['approve', 'reject'].includes(action)) {
        if (!['registrar', 'dean'].includes(a.role))
          error('FORBIDDEN', 'Only the registrar or academic approver can decide.', 403);
        if (row.kind === 'Appeal' && a.role !== 'dean')
          error('FORBIDDEN', 'Academic appeals require the dean.', 403);
        if (row.status !== 'Submitted') error('STATE', 'Request already has a decision.', 409);
        if (a.student_id === row.student_id)
          error('SELF_APPROVAL', 'A learner cannot approve their own request.', 403);
        if (!data.reason) error('REASON', 'A decision reason is required.');
        update.status = action === 'approve' ? 'Approved' : 'Rejected';
        update.reviewer_id = a.id;
        update.decision_reason = data.reason;
      } else error('ACTION', 'Action is not available.');
      const keys = Object.keys(update);
      const result = (
        await tx.query(
          `UPDATE ${table[resource]} SET ${keys.map((k, i) => `${k}=$${i + 1}`).join(',')} WHERE institution_id=$${keys.length + 1} AND id=$${keys.length + 2} RETURNING *`,
          [...Object.values(update), a.institution_id, id],
        )
      ).rows[0];
      await this.domain.audit(tx, a, `${resource}.${action}`, id, data.reason, row);
      return result;
    });
  }
}
