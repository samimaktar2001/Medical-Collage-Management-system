import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import type { PageContent } from './content';
export const categories = [
  'All notices',
  'Admissions',
  'Academic',
  'Examinations',
  'Student services',
  'General',
];
export function displayDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));
}
export function noticeDate(notice: PageContent) {
  return notice.metadata?.issue_date || notice.published_at;
}
export function sortNotices(notices: PageContent[]) {
  return notices.sort((a, b) => noticeDate(b).localeCompare(noticeDate(a)));
}
export function NoticeRows({ notices }: { notices: PageContent[] }) {
  return (
    <div className="college-notice-list">
      {notices.length ? (
        notices.map((notice) => (
          <article key={notice.slug} className="college-notice-row">
            <time dateTime={noticeDate(notice).slice(0, 10)}>
              {displayDate(noticeDate(notice))}
            </time>
            <div>
              <span className="college-tag">{notice.metadata?.category || 'General'}</span>
              {notice.notice_state === 'Archived' && (
                <span className="college-archive-tag">Archived</span>
              )}
            </div>
            <div>
              <h3>
                <Link href={`/institution/${notice.slug}`}>{notice.title}</Link>
              </h3>
              <p>{notice.body.split('\n')[0]}</p>
            </div>
            <Link
              className="college-row-arrow"
              href={`/institution/${notice.slug}`}
              aria-label={`Read ${notice.title}`}
            >
              <ArrowRight size={19} />
            </Link>
          </article>
        ))
      ) : (
        <p className="college-empty" role="status">
          No published notices match this selection. Try another category or view all notices.
        </p>
      )}
    </div>
  );
}
export function AdmissionsPanel() {
  return (
    <aside className="college-admissions" aria-labelledby="admission-title">
      <span className="college-eyebrow">ADMISSIONS INFORMATION</span>
      <h2 id="admission-title">Admission update</h2>
      <dl>
        <div>
          <dt>Admission stage</dt>
          <dd>Not yet announced</dd>
        </div>
        <div>
          <dt>Local form window</dt>
          <dd>Not open</dd>
        </div>
        <div>
          <dt>Seat vacancy</dt>
          <dd>Not yet published</dd>
        </div>
      </dl>
      <Link className="college-button" href="/institution/admissions">
        View admission guidance <ArrowRight size={18} />
      </Link>
      <div className="college-admission-links">
        {[
          ['How to apply (process overview)', 'admissions'],
          ['Programme information', 'programmes'],
          ['Required documents', 'reporting-checklist'],
          ['Admission enquiries', 'contact'],
        ].map(([title, slug]) => (
          <Link key={title} href={`/institution/${slug}`}>
            <FileText size={18} />
            {title}
          </Link>
        ))}
      </div>
      <p className="college-small">
        No live admission cycle or verified seat snapshot is configured.
      </p>
    </aside>
  );
}
export function PageBody({ body }: { body: string }) {
  return (
    <div className="college-prose">
      {body.split(/\n\s*\n/).map((block, index) => {
        const lines = block.split('\n');
        if (lines[0].startsWith('## '))
          return (
            <section key={index}>
              <h2>{lines[0].slice(3)}</h2>
              <PageBody body={lines.slice(1).join('\n')} />
            </section>
          );
        if (lines.every((line) => line.startsWith('- ')))
          return (
            <ul key={index}>
              {lines.map((line, i) => (
                <li key={i}>{line.slice(2)}</li>
              ))}
            </ul>
          );
        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
