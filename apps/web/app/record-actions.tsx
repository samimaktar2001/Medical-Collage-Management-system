'use client';
import CustomSelect from './custom-select';
import { Controller, useForm } from 'react-hook-form';
import { Row } from './workspace';
import { Field } from './resource-config';
export type Action = { id: string; label: string; reason?: boolean; fields?: Field[] };
export function actionsFor(resource: string, row: Row, me: Row): Action[] {
  const role = me.role,
    status = row.status;
  const actions: Action[] = [];
  const add = (id: string, label: string, reason = false, fields?: Field[]) =>
    actions.push({ id, label, reason, fields });
  if (resource === 'applications') {
    if (role === 'registrar' && ['Submitted', 'Clarification'].includes(status))
      add('start-review', 'Start verification');
    if (role === 'registrar' && ['Verification', 'Clarification'].includes(status))
      add('verify', 'Complete verification', true, [
        { key: 'eligibility_verified', label: 'Eligibility checked', type: 'checkbox' },
        { key: 'allotment_verified', label: 'External allotment checked', type: 'checkbox' },
        { key: 'payment_verified', label: 'Payment independently verified', type: 'checkbox' },
        { key: 'waiver_reason', label: 'Authorized waiver reason (if not paid)', optional: true },
      ]);
    if (role === 'registrar' && ['Submitted', 'Verification', 'Verified'].includes(status))
      add('clarify', 'Request clarification', true);
    if (role === 'dean' && status === 'Verified') add('approve', 'Approve admission', true);
    if (role === 'registrar' && status === 'Approved') add('enroll', 'Confirm enrolment', true);
  }
  if (resource === 'sessions' && role === 'faculty') {
    if (status === 'Planned') add('conduct', 'Mark conducted');
    if (['Planned', 'Conducted'].includes(status)) add('cancel', 'Cancel session', true);
  }
  if (resource === 'corrections' && role === 'dean' && status === 'Pending')
    add('approve', 'Approve correction', true);
  if (resource === 'logbook') {
    if (role === 'faculty' && status === 'Submitted') {
      add('verify', 'Verify evidence', true);
      add('return', 'Return for revision', true);
      add('reject', 'Reject evidence', true);
    }
    if (role === 'student' && status === 'Returned')
      add('resubmit', 'Resubmit evidence', false, [
        { key: 'reflection', label: 'Revised reflection', type: 'textarea', wide: true },
      ]);
  }
  if (resource === 'assessments') {
    if (role === 'faculty' && status === 'Draft') add('submit', 'Lock & submit marks');
    if (role === 'dean' && status === 'Entry locked') add('moderate', 'Approve moderation', true);
    if (role === 'dean' && status === 'Moderated') add('publish', 'Publish results', true);
    if (role === 'dean' && status === 'Published') add('revoke', 'Revoke publication', true);
  }
  if (resource === 'invoices' && role === 'finance' && row.paid_minor < row.amount_minor)
    add('record-payment', 'Record verified offline payment', true, [
      { key: 'amount_minor', label: 'Amount in paise', type: 'number' },
      { key: 'reference', label: 'Unique bank / receipt reference' },
      { key: 'method', label: 'Method', options: ['Bank transfer', 'Cash'] },
    ]);
  if (resource === 'refunds') {
    if (role === 'dean' && status === 'Pending approval')
      add('approve-refund', 'Approve refund', true);
    if (role === 'finance' && status === 'Approved · awaiting completion')
      add('complete', 'Confirm completed refund', true);
  }
  if (resource === 'content') {
    if (role === 'editor' && row.owner_id === me.id && ['Draft', 'Returned'].includes(status)) {
      add('edit', 'Edit draft', false, [
        { key: 'title', label: 'Title', value: row.title },
        { key: 'body', label: 'Content', type: 'textarea', value: row.body, wide: true },
        {
          key: 'category',
          label: 'Category',
          value: row.category,
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
        {
          key: 'issue_date',
          label: 'Issue date',
          type: 'date',
          value: String(row.issue_date || '').slice(0, 10),
          optional: true,
        },
        { key: 'reference', label: 'Notice reference', value: row.reference, optional: true },
        {
          key: 'available_on',
          label: 'Visible from (IST)',
          type: 'date',
          value: String(row.available_on || '').slice(0, 10),
          optional: true,
        },
        {
          key: 'archive_on',
          label: 'Archive from (IST)',
          type: 'date',
          value: String(row.archive_on || '').slice(0, 10),
          optional: true,
        },
        {
          key: 'review_date',
          label: 'Next review',
          type: 'date',
          value: String(row.review_date).slice(0, 10),
        },
      ]);
      add('submit', 'Submit for review');
    }
    if (role === 'publisher' && status === 'In review') {
      add('publish', 'Publish approved content', true);
      add('return', 'Return to author', true);
    }
    if (role === 'publisher' && status === 'Published')
      add('archive', 'Withdraw from public site', true);
    if (role === 'editor' && row.owner_id === me.id && status === 'Published')
      add('revise', 'Create draft revision');
  }
  if (
    resource === 'tickets' &&
    status !== 'Resolved' &&
    ((row.confidential && role === 'committee') ||
      (!row.confidential && ['admin', 'registrar'].includes(role)))
  ) {
    add('resolve', 'Resolve request', true);
    add('assign', 'Assign request', false, [{ key: 'assigned_to', label: 'Assignee user ID' }]);
  }
  if (resource === 'policies' && role === 'dean' && status === 'Draft')
    add('approve', 'Approve policy version', true);
  if (resource === 'learning' && role === 'faculty' && row.kind === 'Assignment')
    add('extend', 'Extend deadline', true, [
      { key: 'due_date', label: 'New deadline', type: 'date' },
    ]);
  if (resource === 'submissions' && role === 'faculty') add('review', 'Review submission', true);
  if (resource === 'requests' && status === 'Submitted' && ['dean', 'registrar'].includes(role)) {
    add('approve', 'Approve request', true);
    add('reject', 'Reject request', true);
  }
  return actions;
}
export function ActionForm({
  action,
  onSubmit,
  onCancel,
  busy,
}: {
  action: Action;
  onSubmit: (data: Row, reason: string) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const { register, handleSubmit, control } = useForm<Row>({
    defaultValues: Object.fromEntries(
      (action.fields || []).map((f) => [
        f.key,
        f.type === 'checkbox' ? false : f.value || f.options?.[0] || '',
      ]),
    ),
  });
  return (
    <form
      className="action-form"
      onSubmit={handleSubmit((v) => {
        const d = { ...v };
        delete d.reason;
        action.fields?.forEach((f) => {
          if (f.type === 'number') d[f.key] = Number(d[f.key]);
        });
        onSubmit(d, v.reason || '');
      })}
    >
      <h3>{action.label}</h3>
      {['enroll', 'publish', 'approve-refund', 'record-payment', 'complete'].includes(
        action.id,
      ) && (
        <p className="callout">
          Review the record carefully. This action records a consequential decision and creates an
          audit entry.
        </p>
      )}
      <div className="form-grid">
        {action.fields?.map((f) => (
          <div className={`form-field ${f.wide ? 'wide' : ''}`} key={f.key}>
            <label htmlFor={`action-${f.key}`}>{f.label}</label>
            {f.options ? (
              <Controller
                name={f.key}
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    id={`action-${f.key}`}
                    label={f.label}
                    name={field.name}
                    value={String(field.value ?? '')}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    options={(f.options || []).map((value) => ({ value, label: value }))}
                  />
                )}
              />
            ) : f.type === 'textarea' ? (
              <textarea id={`action-${f.key}`} {...register(f.key, { required: !f.optional })} />
            ) : (
              <input
                id={`action-${f.key}`}
                type={f.type || 'text'}
                {...register(f.key, { required: f.type !== 'checkbox' && !f.optional })}
              />
            )}
          </div>
        ))}
        {action.reason && (
          <div className="form-field wide">
            <label htmlFor="action-reason">Reason / review note *</label>
            <textarea id="action-reason" {...register('reason', { required: true })} />
          </div>
        )}
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Back
        </button>
        <button className="primary" disabled={busy} type="submit">
          {busy ? 'Saving…' : action.label}
        </button>
      </div>
    </form>
  );
}
