'use client';
import CustomSelect from './custom-select';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { api, Row, viewNames, Badge, money, shortDate, clockTime } from './workspace';
import { columns, createRoles, descriptions, statuses } from './resource-config';
import { Editor } from './record-editor';
import { Detail } from './record-detail';
import ImportDialog from './import-dialog';
export function display(key: string, v: any) {
  if (v === null || v === undefined) return '—';
  if (key.endsWith('_minor')) return money(v);
  if (key === 'status') return <Badge value={String(v)} />;
  if (key === 'confidential') return v ? 'Committee only' : 'Standard';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (
    [
      'created_at',
      'starts_at',
      'activity_date',
      'due_date',
      'review_date',
      'effective_date',
      'ends_at',
      'published_at',
    ].includes(key)
  )
    return (
      <>
        {shortDate(v)}
        {key === 'starts_at' && <small className="cell-sub">{clockTime(v)} IST</small>}
      </>
    );
  return String(v).length > 85 ? `${String(v).slice(0, 82)}…` : String(v);
}
export function ResourceView({ resource, me }: { resource: string; me: Row }) {
  const params = useSearchParams(),
    router = useRouter(),
    client = useQueryClient();
  const search = params.get('q') || '',
    page = Number(params.get('page')) || 1,
    status = params.get('status') || '';
  const [create, setCreate] = useState(false),
    [importing, setImporting] = useState(false),
    [detail, setDetail] = useState<string | null>(null),
    [toast, setToast] = useState('');
  const q = useQuery({
    queryKey: [resource, me.id, search, page, status],
    queryFn: () =>
      api(
        `${resource}?q=${encodeURIComponent(search)}&page=${page}&status=${encodeURIComponent(status)}`,
      ),
  });
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key !== 'page') next.delete('page');
    router.replace(`/portal?${next}`, { scroll: false });
  };
  const saved = () => {
    client.invalidateQueries();
    setToast('Saved to the college record.');
    setTimeout(() => setToast(''), 4000);
  };
  const canCreate = createRoles[resource]?.some((r) => r === 'all' || r === me.role);
  return (
    <>
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            {['sessions', 'competencies', 'assessments', 'logbook'].includes(resource)
              ? 'ACADEMIC MANAGEMENT'
              : 'INSTITUTION WORKSPACE'}
          </div>
          <h1>{viewNames[resource]}</h1>
          <p>{descriptions[resource]}</p>
        </div>
        {resource === 'applications' && me.role === 'registrar' && (
          <button onClick={() => setImporting(true)}>Import allotment CSV</button>
        )}
        {canCreate && (
          <button className="primary" onClick={() => setCreate(true)}>
            <Plus size={17} />
            {resource === 'documents'
              ? 'Upload document'
              : resource === 'evidence'
                ? 'Freeze evidence pack'
                : 'New record'}
          </button>
        )}
      </div>
      {resource === 'invoices' && (
        <div className="callout">
          Online collection is disabled until a payment provider is configured. Offline receipts
          require a verified bank or cash reference.
        </div>
      )}
      {resource === 'documents' && (
        <div className="callout">
          The trusted file scanner is not connected. Uploaded documents remain quarantined.
        </div>
      )}
      <section className="panel">
        <div className="toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              aria-label={`Search ${viewNames[resource]}`}
              placeholder="Search records…"
              value={search}
              onChange={(e) => setParam('q', e.target.value)}
            />
          </div>
          {statuses[resource] && (
            <CustomSelect
              label="Filter by status"
              value={status}
              onValueChange={(value) => setParam('status', value)}
              options={[
                { value: '', label: 'All statuses' },
                ...statuses[resource].map((s) => ({ value: s, label: s })),
              ]}
            />
          )}
          <span className="record-count">{q.data?.total ?? '—'} records in your scope</span>
        </div>
        {q.isPending ? (
          <div className="empty" aria-busy="true">
            <Loader2 size={30} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem' }}>Loading records…</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : q.error ? (
          <div className="empty">
            <p className="inline-error">{q.error.message}</p>
            <button onClick={() => q.refetch()}>Try again</button>
          </div>
        ) : q.data.items.length === 0 ? (
          <div className="empty">
            <FileText size={30} />
            <h3>No records to show</h3>
            <p>
              {search || status
                ? 'Try another search or status filter.'
                : resource === 'students' && me.role === 'student'
                  ? 'Your student profile is not yet fully linked. Please contact the registrar.'
                  : 'Records created in your scope will appear here.'}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table aria-label={viewNames[resource]}>
              <thead>
                <tr>
                  {columns[resource].map(([key, label]) => (
                    <th key={key}>{label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {q.data.items.map((r: Row) => (
                  <tr key={r.id}>
                    {columns[resource].map(([key], i) => (
                      <td key={key} className={i === 0 ? 'cell-name' : ''}>
                        {display(key, r[key])}
                        {i === 0 && resource === 'students' && (
                          <span className="cell-sub">{r.email || r.programme}</span>
                        )}
                      </td>
                    ))}
                    <td>
                      <button
                        className="row-link"
                        onClick={() => setDetail(r.id)}
                        aria-label={`Open ${r.name || r.title || r.activity || r.reference || r.id}`}
                      >
                        View <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination">
          <span>
            Page {page} of {Math.max(1, Math.ceil((q.data?.total || 0) / 20))}
          </span>
          <div>
            <button
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => setParam('page', String(page - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next page"
              disabled={page * 20 >= (q.data?.total || 0)}
              onClick={() => setParam('page', String(page + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
      <div className="data-footnote">
        <ShieldCheck size={14} /> Scoped to {me.role} · Server-validated permissions · Changes are
        audited
      </div>
      {importing && <ImportDialog me={me} onClose={() => setImporting(false)} onSaved={saved} />}{' '}
      {create && (
        <Editor
          resource={resource}
          me={me}
          onClose={() => setCreate(false)}
          onSaved={() => {
            setCreate(false);
            saved();
          }}
        />
      )}
      {detail && (
        <Detail
          resource={resource}
          id={detail}
          me={me}
          onClose={() => setDetail(null)}
          onSaved={saved}
        />
      )}{' '}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </>
  );
}
