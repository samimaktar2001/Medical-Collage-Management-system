import Link from 'next/link';
import CollegeSelect from '../select';
import { publicPages } from '../content';
import { NoticeRows, sortNotices } from '../components';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Notices & circulars · Medora' };
export default async function Notices({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    state?: string;
    year?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const all = (await publicPages()).filter((p) => p.kind === 'Notice');
  const category = params.category || 'All',
    state = params.state === 'Archived' ? 'Archived' : 'Current',
    q = (params.q || '').slice(0, 150),
    year = params.year || 'All';
  const filtered = sortNotices(
    all.filter(
      (n) =>
        n.notice_state === state &&
        (category === 'All' || n.metadata?.category === category) &&
        (year === 'All' || (n.metadata?.issue_date || n.published_at).startsWith(year)) &&
        `${n.title} ${n.body} ${n.metadata?.reference || ''}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    ),
  );
  const count = Math.max(1, Math.ceil(filtered.length / 10));
  const page = Math.min(count, Math.max(1, parseInt(params.page || '1') || 1));
  const pageHref = (n: number) =>
    `/institution/notices?${new URLSearchParams({ category, state, q, year, page: String(n) })}`;
  return (
    <main id="main-content" tabIndex={-1} className="college-width college-interior">
      <nav className="college-breadcrumb" aria-label="Breadcrumb">
        <Link href="/institution">Home</Link>
        <span>/</span>
        <span>Notices</span>
      </nav>
      <span className="college-eyebrow">INFORMATION & UPDATES</span>
      <h1>Notices & circulars</h1>
      <p>
        Find published announcements, academic information and archived notices. All examples are
        demonstration content.
      </p>
      <form action="/institution/notices" className="college-notice-filters">
        <label>
          Keyword
          <input name="q" defaultValue={q} placeholder="Title, reference or keyword" />
        </label>
        <CollegeSelect
          key={`category-${category}`}
          label="Category"
          name="category"
          defaultValue={category}
          options={[
            'All',
            'General',
            'Admissions',
            'Academic',
            'Examinations',
            'Student services',
            'Research',
            'Recruitment',
            'Tender',
          ]}
        />
        <CollegeSelect
          key={`year-${year}`}
          label="Year"
          name="year"
          defaultValue={year}
          options={[
            'All',
            ...new Set(all.map((n) => (n.metadata?.issue_date || n.published_at).slice(0, 4))),
          ]}
        />
        <CollegeSelect
          key={`state-${state}`}
          label="View"
          name="state"
          defaultValue={state}
          options={['Current', 'Archived']}
        />
        <button type="submit" className="college-button">
          Filter notices
        </button>
        <Link href="/institution/notices">Reset</Link>
      </form>
      <p className="college-small" role="status">
        {filtered.length} {state.toLowerCase()} notices · Page {page} of {count}
      </p>
      <NoticeRows notices={filtered.slice((page - 1) * 10, page * 10)} />
      <nav aria-label="Notice pagination" className="college-pagination">
        {page > 1 && <Link href={pageHref(page - 1)}>Previous page</Link>}
        {page < count && <Link href={pageHref(page + 1)}>Next page</Link>}
      </nav>
    </main>
  );
}
