'use client';
import CustomSelect from './custom-select';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { api, Dialog, Row, viewNames } from './workspace';
import { fields } from './resource-config';
export function Editor({
  resource,
  me,
  onClose,
  onSaved,
}: {
  resource: string;
  me: Row;
  onClose: () => void;
  onSaved: () => void;
}) {
  const options = useQuery({ queryKey: ['options', me.id], queryFn: () => api('options') });
  const defaults = Object.fromEntries(
    fields[resource].map((f) => [
      f.key,
      f.type === 'checkbox' ? false : f.value || f.options?.[0] || '',
    ]),
  );
  if (resource === 'sessions') defaults.faculty_id = me.role === 'faculty' ? me.id : '';
  if (resource === 'assessments') defaults.examiner_id = me.id;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Row>({ defaultValues: defaults });
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [discard, setDiscard] = useState(false);
  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', fn);
    return () => window.removeEventListener('beforeunload', fn);
  }, [isDirty]);
  const close = () => (isDirty ? setDiscard(true) : onClose());
  return (
    <Dialog title={`New ${viewNames[resource].toLowerCase()}`} onClose={close}>
      <div className="dialog-body">
        {discard ? (
          <>
            <p>Discard the unsaved changes in this form?</p>
            <div className="form-actions">
              <button onClick={() => setDiscard(false)}>Keep editing</button>
              <button onClick={onClose}>Discard changes</button>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(async (values) => {
              setBusy(true);
              setError('');
              try {
                const payload: Row = { ...values };
                for (const f of fields[resource]) {
                  if (f.type === 'number') payload[f.key] = Number(values[f.key]);
                  if (f.type === 'datetime-local')
                    payload[f.key] = new Date(values[f.key]).toISOString();
                }
                if (resource === 'learning' && !payload.due_date) payload.due_date = null;
                if (resource === 'policies') {
                  try {
                    payload.config = JSON.parse(payload.config);
                  } catch {
                    throw new Error(
                      'Configuration must be valid JSON. Example for Attendance: {"Theory":75,"Practical":75,"Posting":75}',
                    );
                  }
                }
                if (resource === 'documents') {
                  const file = values.file[0] as File;
                  if (!file || file.size > 5242880) throw new Error('Choose a file up to 5 MB.');
                  const encoded = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                  delete payload.file;
                  payload.name = file.name;
                  payload.mime = file.type;
                  payload.content_base64 = encoded;
                }
                await api(resource, 'POST', payload, me.csrf);
                onSaved();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            })}
          >
            {['logbook', 'documents', 'tickets'].includes(resource) && (
              <div className="callout">
                Do not include patient names, MRNs, ABHA numbers or clinical charts.{' '}
                {resource === 'documents'
                  ? 'Uploads are quarantined; scanning is not connected.'
                  : ''}
                {resource === 'tickets'
                  ? 'Confidential concerns are visible only to you and the designated committee.'
                  : ''}
              </div>
            )}
            <div className="form-grid">
              {fields[resource].map((f) => (
                <div className={`form-field ${f.wide ? 'wide' : ''}`} key={f.key}>
                  <label htmlFor={`field-${f.key}`}>
                    {f.label}
                    {!f.optional && f.type !== 'checkbox' ? ' *' : ''}
                  </label>
                  {f.options || f.source ? (
                    <Controller
                      name={f.key}
                      control={control}
                      rules={{ required: !f.optional && 'This field is required.' }}
                      render={({ field, fieldState }) => (
                        <CustomSelect
                          id={`field-${f.key}`}
                          label={f.label}
                          name={field.name}
                          value={String(field.value ?? '')}
                          onValueChange={field.onChange}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          required={!f.optional}
                          invalid={fieldState.invalid}
                          options={[
                            { value: '', label: 'Select…' },
                            ...(f.options || []).map((value) => ({ value, label: value })),
                            ...(f.source
                              ? (options.data?.[f.source] || [])
                                  .filter((r: Row) => f.source !== 'people' || r.role === 'faculty')
                                  .map((r: Row) => ({
                                    value:
                                      f.source === 'departments' || f.source === 'batches'
                                        ? r.name
                                        : r.id,
                                    label:
                                      f.source === 'departments' || f.source === 'batches'
                                        ? r.name
                                        : `${r.name || `${r.code || r.programme} · ${r.title || r.batch}`} ${r.capacity ? `(${r.capacity - r.occupied} available)` : ''}`.trim(),
                                  }))
                              : []),
                          ]}
                        />
                      )}
                    />
                  ) : f.type === 'textarea' ? (
                    <textarea
                      id={`field-${f.key}`}
                      {...register(f.key, {
                        required: 'This field is required.',
                        maxLength: 10000,
                      })}
                    />
                  ) : (
                    <input
                      id={`field-${f.key}`}
                      type={f.type || 'text'}
                      accept={f.type === 'file' ? '.pdf,.png,.jpg,.jpeg' : undefined}
                      min={f.type === 'number' ? 1 : undefined}
                      {...register(f.key, {
                        required:
                          f.type !== 'checkbox' && !f.optional ? 'This field is required.' : false,
                        maxLength: f.type === 'file' ? undefined : 250,
                      })}
                    />
                  )}{' '}
                  {errors[f.key] && (
                    <p className="field-error" role="alert">
                      {String(errors[f.key]?.message)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <button type="button" onClick={close}>
                Cancel
              </button>
              <button type="submit" className="primary" disabled={busy}>
                {busy ? 'Saving…' : 'Save record'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  );
}
