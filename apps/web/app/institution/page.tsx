import Link from 'next/link';
import { ArrowRight, CalendarDays, FileText, Users } from 'lucide-react';
import { publicPages } from './content';
import { AdmissionsPanel, categories, NoticeRows, sortNotices } from './components';
export const dynamic = 'force-dynamic';
const services = [
  {
    Icon: CalendarDays,
    title: 'Academic calendar',
    description: 'View key dates, schedules and events',
    slug: 'calendar',
  },
  {
    Icon: FileText,
    title: 'Forms & service requests',
    description: 'Find the correct route for your request',
    slug: 'forms',
  },
  {
    Icon: Users,
    title: 'Student support',
    description: 'Academic guidance and wellbeing',
    slug: 'student-services',
  },
];
export default async function Institution({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = '', category = 'All notices' } = await searchParams;
  const pages = await publicPages(undefined, 'en', q);
  const introduction = pages.find((p) => p.slug === 'home-introduction');
  const searchResults = pages.filter((p) => p.slug !== 'home-introduction');
  const notices = sortNotices(
    pages.filter(
      (p) =>
        p.kind === 'Notice' &&
        p.notice_state === 'Current' &&
        (category === 'All notices' || p.metadata?.category === category),
    ),
  ).slice(0, 3);
  if (q)
    return (
      <main id="main-content" tabIndex={-1} className="college-width college-interior">
        <nav aria-label="Breadcrumb">
          <Link href="/institution">Home</Link> / Search
        </nav>
        <h1>Search results</h1>
        <p>
          {searchResults.length} published results for “{q}”
        </p>
        <div className="college-search-results">
          {searchResults.map((p) => (
            <article key={p.slug}>
              <span className="college-eyebrow">{p.kind}</span>
              <h2>
                <Link href={`/institution/${p.slug}`}>
                  {p.title} <ArrowRight size={18} />
                </Link>
              </h2>
              <p>{p.body.split('\n')[0]}</p>
            </article>
          ))}
        </div>
        {!searchResults.length && (
          <p>No published information matches. Try a programme, department or notice title.</p>
        )}
      </main>
    );
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="college-intro">
        <div className="college-width">
          <span className="college-eyebrow">WELCOME TO MEDORA MEDICAL COLLEGE</span>
          <h1>{introduction?.title || 'Academic information & admissions'}</h1>
          <p>
            {introduction?.body ||
              'Find published college information, notices and admissions guidance. This is a synthetic demonstration institution.'}
          </p>
        </div>
      </section>
      <section className="college-width college-board-grid" aria-label="Notices and admissions">
        <div id="notice-board">
          <div className="college-section-heading">
            <h2>Notice Board</h2>
            <Link href="/institution/notices">
              View all notices <ArrowRight size={17} />
            </Link>
          </div>
          <nav className="college-categories" aria-label="Notice categories">
            {categories.map((item) => (
              <Link
                key={item}
                aria-current={category === item ? 'true' : undefined}
                href={`/institution?category=${encodeURIComponent(item)}#notice-board`}
              >
                {item}
              </Link>
            ))}
          </nav>
          <NoticeRows notices={notices} />
        </div>
        <AdmissionsPanel />
      </section>
      <section className="college-services" aria-label="Quick services">
        <div className="college-width">
          {services.map(({ Icon, title, description, slug }) => (
            <Link href={`/institution/${slug}`} key={slug}>
              <Icon size={36} strokeWidth={1.6} />
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <ArrowRight size={19} />
            </Link>
          ))}
        </div>
      </section>
      <section className="college-width college-departments">
        <div className="college-section-heading">
          <h2>Our programmes and departments</h2>
          <Link href="/institution/departments">
            View all departments <ArrowRight size={17} />
          </Link>
        </div>
        <div className="college-department-links">
          {[
            ['MBBS programme', 'programmes'],
            ['Anatomy', 'departments'],
            ['Physiology', 'departments'],
            ['Faculty directory', 'faculty'],
            ['Learning facilities', 'facilities'],
          ].map(([title, slug]) => (
            <Link key={title} href={`/institution/${slug}`}>
              {title}
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="college-campus" aria-label="Illustrative campus concept">
        <div className="college-width">
          <div>
            <p>
              A supportive environment
              <br />
              for learning and service
            </p>
            <span>Illustrative campus concept — not a real facility</span>
          </div>
        </div>
      </section>
    </main>
  );
}
