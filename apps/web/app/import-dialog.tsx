'use client';
import { useState } from 'react';
import { api, Dialog, Row } from './workspace';
function parseCSV(source: string) {
  const rows: string[][] = [];
  let row: string[] = [],
    cell = '',
    quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"') {
      if (quoted && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && source[i + 1] === '\n') i++;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift()?.map((h) => h.replace(/^\uFEFF/, '')) || [];
  const required = ['name', 'email', 'external_ref', 'pool_id', 'department'];
  if (required.some((h) => !headers.includes(h)) || headers.some((h) => !required.includes(h)))
    throw new Error('Headers must be: name,email,external_ref,pool_id,department');
  return rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] || ''])));
}
export default function ImportDialog({
  me,
  onClose,
  onSaved,
}: {
  me: Row;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [file, setFile] = useState<File | null>(null),
    [source, setSource] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [result, setResult] = useState<Row | null>(null);
  return (
    <Dialog title="Import verified allotment source" onClose={onClose}>
      <div className="dialog-body">
        <p className="callout">
          Import creates submitted applications only. Each row still requires verification and
          approval. Duplicate external allotment references are rejected.
        </p>
        {!result ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError('');
              try {
                if (!file || file.size > 1000000) throw new Error('Choose a CSV up to 1 MB.');
                const rows = parseCSV(await file.text());
                if (rows.length > 1000) throw new Error('Import up to 1,000 rows per batch.');
                const data = await api(
                  'applications/import',
                  'POST',
                  { source_batch: source, rows },
                  me.csrf,
                );
                setResult(data);
                onSaved();
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label htmlFor="import-source">Source batch reference</label>
            <input
              id="import-source"
              required
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
            <p className="form-note">CSV header: name,email,external_ref,pool_id,department</p>
            <label htmlFor="import-file">Allotment CSV</label>
            <input
              id="import-file"
              type="file"
              accept=".csv,text/csv"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="form-note">
              Use the exact seat pool ID shown in an existing application. Sample pool: pool-mbbs.
              No automatic enrolment.
            </p>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="primary" disabled={busy}>
                {busy ? 'Importing…' : 'Validate & import'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3>
              Import complete · {result.outcomes.filter((r: Row) => r.status === 'Imported').length}{' '}
              imported
            </h3>
            <p>Atomicity: per row. Rejected rows do not undo successful rows.</p>
            <table>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Result</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {result.outcomes.map((r: Row) => (
                  <tr key={r.row}>
                    <td>{r.row}</td>
                    <td>{r.status}</td>
                    <td>{r.message || r.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="form-actions">
              <button
                onClick={() => {
                  const csv =
                    'row,status,message\r\n' +
                    result.outcomes
                      .map((r: Row) =>
                        [r.row, r.status, r.message || r.id]
                          .map(
                            (v) =>
                              '"' +
                              String(v)
                                .replace(/^[=+@-]/, "'$&")
                                .replaceAll('"', '""') +
                              '"',
                          )
                          .join(','),
                      )
                      .join('\r\n');
                  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'allotment-import-results.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download results
              </button>
              <button onClick={onClose} className="primary">
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
