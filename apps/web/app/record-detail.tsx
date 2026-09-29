'use client';
import CustomSelect from './custom-select';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDownToLine } from 'lucide-react';
import { api, Row, Dialog, viewNames, Badge } from './workspace';
import { Action, ActionForm, actionsFor } from './record-actions';
import { display } from './workflows';
export function Detail({
  resource,
  id,
  me,
  onClose,
  onSaved,
}: {
  resource: string;
  id: string;
  me: Row;
  onClose: () => void;
  onSaved: () => void;
}) {
  const client = useQueryClient();
  const q = useQuery({
    queryKey: ['detail', resource, id, me.id],
    queryFn: () => api(`${resource}/${id}`),
    staleTime: Infinity,
  });
  const [action, setAction] = useState<Action | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const [register, setRegister] = useState<Record<string, string>>({}),
    [marks, setMarks] = useState<Row>({});
  const idempotencyKeyRef = useRef<string>('');
  const options = useQuery({
    queryKey: ['options', me.id],
    queryFn: () => api('options'),
    enabled: resource === 'assessments' && me.role === 'faculty',
  });
  const attendance = useQuery({
    queryKey: ['attendance-summary', id, me.id],
    queryFn: () => api(`attendance-summary?student_id=${id}`),
    enabled: resource === 'students' && me.role !== 'finance',
  });
  const row = q.data;
  useEffect(() => {
    if (row?.register)
      setRegister(Object.fromEntries(row.register.map((r: Row) => [r.id, r.status || ''])));
    if (row?.marks)
      setMarks(
        Object.fromEntries(
          row.marks.map((m: Row) => [m.student_id, { state: m.state, score: m.score ?? '' }]),
        ),
      );
  }, [row]);
  const run = async (act: string, data?: unknown, reason = '') => {
    setBusy(true);
    setError('');
    try {
      const needsIdempotency = ['enroll', 'record-payment', 'approve-refund'].includes(act);
      if (needsIdempotency && !idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID();
      }
      await api(
        `${resource}/${id}/${act}`,
        'POST',
        { version: row.version, reason, ...(data !== undefined ? { data } : {}) },
        me.csrf,
        needsIdempotency ? idempotencyKeyRef.current : undefined,
      );
      idempotencyKeyRef.current = '';
      await client.invalidateQueries();
      setAction(null);
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      title={row?.name || row?.title || row?.activity || viewNames[resource]}
      onClose={onClose}
    >
      <div className="dialog-body">
        {q.isPending ? (
          <p>Loading record…</p>
        ) : q.error ? (
          <p className="inline-error">{q.error.message}</p>
        ) : (
          <>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            {action ? (
              <ActionForm
                key={action.id}
                action={action}
                busy={busy}
                onCancel={() => {
                  setAction(null);
                  setError('');
                }}
                onSubmit={(data, reason) =>
                  run(action.id, action.fields ? data : undefined, reason)
                }
              />
            ) : (
              <>
                <dl className="detail-meta">
                  {Object.entries(row)
                    .filter(
                      ([key, value]) =>
                        ![
                          'register',
                          'marks',
                          'snapshot',
                          'manifest',
                          'body',
                          'reflection',
                          'description',
                          'published_body',
                          'content_base64',
                          'previous',
                          'config',
                        ].includes(key) &&
                        value !== null &&
                        typeof value !== 'object',
                    )
                    .slice(0, 18)
                    .map(([key, value]) => (
                      <div key={key}>
                        <dt>{key.replaceAll('_', ' ')}</dt>
                        <dd>{display(key, value)}</dd>
                      </div>
                    ))}
                </dl>
                {['body', 'reflection', 'description', 'review_note', 'resolution', 'rubric']
                  .filter((k) => row[k])
                  .map((k) => (
                    <div key={k}>
                      <h3>{k.replaceAll('_', ' ')}</h3>
                      <p className="detail-text">{row[k]}</p>
                    </div>
                  ))}
                {row.config && (
                  <pre className="detail-text">{JSON.stringify(row.config, null, 2)}</pre>
                )}
                {resource === 'students' && me.role !== 'finance' && (
                  <section>
                    <h3>Attendance by teaching category</h3>
                    {attendance.data ? (
                      <>
                        <p className="form-note">
                          {attendance.data.policy
                            ? 'Using approved policy ' + attendance.data.policy.id
                            : 'No approved attendance policy. Eligibility remains provisional.'}
                        </p>
                        <div className="table-wrap">
                          <table>
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Present / finalized</th>
                                <th>Rate</th>
                                <th>Eligibility</th>
                              </tr>
                            </thead>
                            <tbody>
                              {attendance.data.categories.map((c: Row) => (
                                <tr key={c.category}>
                                  <td>{c.category}</td>
                                  <td>
                                    {c.present} / {c.total}
                                  </td>
                                  <td>{c.percent === null ? '—' : `${c.percent}%`}</td>
                                  <td>
                                    <Badge value={c.status} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <p>{attendance.error?.message || 'Loading attendance…'}</p>
                    )}
                  </section>
                )}
                {resource === 'sessions' && (
                  <section>
                    <h3>Attendance register</h3>
                    <p className="form-note">
                      Mark each learner explicitly. Finalization locks the register; later changes
                      require approval.
                    </p>
                    <div className="table-wrap">
                      <table className="register-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Student ID</th>
                            <th>Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.register.map((s: Row) => (
                            <tr key={s.id}>
                              <td>{s.name}</td>
                              <td>{s.number}</td>
                              <td>
                                {me.role === 'faculty' && row.status === 'Conducted' ? (
                                  <CustomSelect
                                    label={`Attendance for ${s.name}`}
                                    value={register[s.id] || ''}
                                    onValueChange={(value) =>
                                      setRegister({ ...register, [s.id]: value })
                                    }
                                    options={[
                                      { value: '', label: 'Not marked' },
                                      ...['Present', 'Absent', 'Excused'].map((value) => ({
                                        value,
                                        label: value,
                                      })),
                                    ]}
                                  />
                                ) : (
                                  <Badge value={s.status || 'Not marked'} />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {me.role === 'faculty' && row.status === 'Conducted' && (
                      <div className="action-bar">
                        <button
                          disabled={busy}
                          onClick={() =>
                            run(
                              'save-register',
                              Object.entries(register)
                                .filter(([, s]) => s)
                                .map(([student_id, status]) => ({ student_id, status })),
                            )
                          }
                        >
                          Save draft
                        </button>
                        <button
                          className="primary"
                          disabled={busy}
                          onClick={() =>
                            run(
                              'finalize',
                              Object.entries(register)
                                .filter(([, s]) => s)
                                .map(([student_id, status]) => ({ student_id, status })),
                            )
                          }
                        >
                          Finalize register
                        </button>
                      </div>
                    )}
                  </section>
                )}
                {resource === 'assessments' && (
                  <section>
                    <h3>{me.role === 'student' ? 'Your published result' : 'Assessment marks'}</h3>
                    <p className="form-note">
                      Absent, withheld and not assessed are separate states; they do not become a
                      zero score.
                    </p>
                    <div className="table-wrap">
                      <table className="register-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>State</th>
                            <th>Marks / {row.max_marks}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(me.role === 'faculty' && row.status === 'Draft'
                            ? options.data?.students
                                ?.filter((s: Row) => s.batch === row.cohort)
                                .map((s: Row) => ({ ...s, student_id: s.id }))
                            : row.marks
                          )?.map((s: Row) => {
                            const m = marks[s.student_id] || { state: 'Not assessed', score: '' };
                            return (
                              <tr key={s.student_id}>
                                <td>{s.name || s.student_id}</td>
                                <td>
                                  {me.role === 'faculty' && row.status === 'Draft' ? (
                                    <CustomSelect
                                      label={`Assessment state for ${s.name}`}
                                      value={m.state}
                                      onValueChange={(value) =>
                                        setMarks({
                                          ...marks,
                                          [s.student_id]: { state: value, score: '' },
                                        })
                                      }
                                      options={['Scored', 'Absent', 'Withheld', 'Not assessed'].map(
                                        (value) => ({ value, label: value }),
                                      )}
                                    />
                                  ) : (
                                    s.state
                                  )}
                                </td>
                                <td>
                                  {me.role === 'faculty' && row.status === 'Draft' ? (
                                    <input
                                      aria-label={`Marks for ${s.name}`}
                                      type="number"
                                      min="0"
                                      max={row.max_marks}
                                      disabled={m.state !== 'Scored'}
                                      value={m.score}
                                      onChange={(e) =>
                                        setMarks({
                                          ...marks,
                                          [s.student_id]: { ...m, score: e.target.value },
                                        })
                                      }
                                    />
                                  ) : (
                                    (s.score ?? '—')
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {me.role === 'faculty' && row.status === 'Draft' && (
                      <div className="action-bar">
                        <button
                          disabled={busy}
                          onClick={() =>
                            run(
                              'save-marks',
                              (options.data?.students || [])
                                .filter((s: Row) => s.batch === row.cohort)
                                .map((s: Row) => {
                                  const m = marks[s.id] || { state: 'Not assessed', score: '' };
                                  return {
                                    student_id: s.id,
                                    state: m.state,
                                    score:
                                      m.state === 'Scored' && m.score !== ''
                                        ? Number(m.score)
                                        : null,
                                  };
                                }),
                            )
                          }
                        >
                          Save marks
                        </button>
                      </div>
                    )}
                  </section>
                )}
                {resource === 'documents' && (
                  <div className="callout">
                    {row.status === 'Clean' ? (
                      <a href={`/api/v1/documents/${id}/download`}>Download approved document</a>
                    ) : (
                      'File is quarantined. The malware-scanning integration is not configured; no preview or download is allowed.'
                    )}
                  </div>
                )}
                {resource === 'evidence' && (
                  <>
                    <div className="callout">
                      This snapshot is frozen. Later changes to student or session records do not
                      alter this evidence pack.
                    </div>
                    <a className="primary" href={`/api/v1/evidence/${id}/download`}>
                      <ArrowDownToLine size={16} /> Download manifest
                    </a>
                  </>
                )}
                {actionsFor(resource, row, me).length > 0 && (
                  <div className="action-bar">
                    {actionsFor(resource, row, me).map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setAction(a);
                          setError('');
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
