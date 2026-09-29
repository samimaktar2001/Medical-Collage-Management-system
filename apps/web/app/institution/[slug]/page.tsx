import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicPages } from '../content';
import Enquiry from '../enquiry';
import { displayDate, noticeDate, PageBody } from '../components';
import PrintButton from '../print-button';
import type { Metadata } from 'next';
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ language?: string }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = (await publicPages(slug))[0];
  const description = page
    ? page.body.split('\n')[0].slice(0, 160)
    : 'Page not found.';
  return {
    title: page ? page.title : 'Page not found',
    description,
    alternates: { canonical: `/institution/${slug}` },
    openGraph: page
      ? {
          title: page.title,
          description,
          type: 'article',
          publishedTime: page.published_at,
        }
      : undefined,
  };
}
export default async function ContentPage({ params, searchParams }: Props) {
  const { slug } = await params,
    { language = 'en' } = await searchParams;
  let page = (await publicPages(slug, language === 'bn' ? 'bn' : 'en'))[0];
  let fallback = false;
  if (!page && language === 'bn') {
    page = (await publicPages(slug, 'en'))[0];
    fallback = true;
  }
  if (!page) notFound();
  return (
    <main id="main-content" tabIndex={-1} className="college-width college-interior">
      <nav aria-label="Breadcrumb" className="college-breadcrumb">
        <Link href="/institution">Home</Link>
        <span>/</span>
        {page.kind === 'Notice' && (
          <>
            <Link href="/institution/notices">Notices</Link>
            <span>/</span>
          </>
        )}
        <span>{page.title}</span>
      </nav>
      <div className="college-detail-heading">
        <div>
          <span className="college-eyebrow">
            {page.kind === 'Notice'
              ? page.metadata?.category || 'General notice'
              : 'COLLEGE INFORMATION'}
          </span>
          <h1>{page.title}</h1>
        </div>
        <PrintButton />
      </div>
      <div className="college-language">
        <Link href={`/institution/${slug}?language=en`} lang="en">
          English
        </Link>
        <Link href={`/institution/${slug}?language=bn`} lang="bn">
          বাংলা
        </Link>
      </div>
      {fallback && (
        <p className="college-callout">
          A reviewed Bengali translation is not available. The approved English version is shown.
        </p>
      )}
      <div className="college-detail-grid">
        <article lang={page.language}>
          {page.kind === 'Notice' && (
            <dl className="college-notice-meta">
              <div>
                <dt>Issued</dt>
                <dd>{displayDate(noticeDate(page))}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{page.metadata?.reference || 'Not supplied'}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{page.notice_state}</dd>
              </div>
            </dl>
          )}
          {page.notice_state === 'Archived' && (
            <p className="college-callout">
              Archived notice — retained for reference. It does not advertise an active application
              window.
            </p>
          )}
          <PageBody body={page.body} />
          {slug === 'contact' && <Enquiry />}
          {['forms', 'student-services'].includes(slug) && (
            <div className="college-related-actions">
              <Link className="college-button" href="/?view=requests">
                Student service requests
              </Link>
              <Link href="/institution/contact">Send a general enquiry</Link>
            </div>
          )}
          {slug === 'grievance' && (
            <Link className="college-button" href="/?view=tickets">
              Sign in to submit a confidential concern
            </Link>
          )}
          <div className="college-content-meta">
            Published {displayDate(page.published_at)} · Review due {displayDate(page.review_date)}
            <br />
            Content owner: demonstration website team · Synthetic content
          </div>
        </article>
        <aside className="college-sidebar">
          <h2>In this section</h2>
          {[
            ['Academic programmes', 'programmes'],
            ['Admissions guidance', 'admissions'],
            ['Notices & circulars', 'notices'],
            ['Forms & service requests', 'forms'],
            ['Student support', 'student-services'],
            ['Contact the college', 'contact'],
          ].map(([label, target]) => (
            <Link
              key={target}
              href={`/institution/${target}`}
              aria-current={slug === target ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <p>
            All institutional profiles and examples are synthetic. No live admissions or payments
            are accepted.
          </p>
        </aside>
      </div>
    </main>
  );
}
