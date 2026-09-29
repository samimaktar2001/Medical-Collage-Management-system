import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, Search } from 'lucide-react';
import Navigation from './navigation';
import './website.css';
const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
export const metadata: Metadata = {
  title: {
    default: 'Medora Medical College',
    template: '%s · Medora Medical College',
  },
  description:
    'Medora Medical College — academic programmes, admissions, notices, examinations and student services.',
  openGraph: {
    type: 'website',
    siteName: 'Medora Medical College',
    url: `${origin}/institution`,
    locale: 'en_IN',
  },
  alternates: {
    canonical: `${origin}/institution`,
  },
  robots: {
    index: true,
    follow: true,
  },
};
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollegeOrUniversity',
  name: 'Medora Medical College',
  url: `${origin}/institution`,
  description:
    'Academic programmes, admissions, examinations, student services and institutional information.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
};
export function CollegeBrand() {
  return (
    <Link href="/institution" className="college-brand" aria-label="Medora Medical College home">
      <span className="college-brand-mark">
        <Activity size={29} strokeWidth={1.7} />
      </span>
      <span>
        medora<small>MEDICAL COLLEGE</small>
      </span>
    </Link>
  );
}
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="college-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="college-utility">
        <div className="college-width">
          <div>
            <a href="#main-content">Skip to content</a>
            <Link href="/institution/accessibility">Accessibility</Link>
            <Link href="/institution/contact">Contact</Link>
          </div>
          <span>DEMONSTRATION · Synthetic institution and content</span>
        </div>
      </div>
      <header className="college-masthead college-width">
        <CollegeBrand />
        <div className="college-descriptor">
          Academic and institutional information
          <small>Education · Care · Research · Community</small>
        </div>
        <form role="search" action="/institution" className="college-search">
          <label className="sr-only" htmlFor="college-search">
            Search the college
          </label>
          <input id="college-search" name="q" placeholder="Search the college…" maxLength={150} />
          <button type="submit" aria-label="Search">
            <Search size={20} />
          </button>
        </form>
        <Link href="/" className="college-button">
          Portal login <ArrowRight size={17} />
        </Link>
      </header>
      <Navigation />
      {children}
      <footer className="college-footer">
        <div className="college-width college-footer-grid">
          <div>
            <CollegeBrand />
            <p>
              A community for learning,
              <br />
              care and a healthier tomorrow.
            </p>
          </div>
          <div>
            <h2>Useful links</h2>
            <div className="college-footer-links">
              {[
                ['About', 'about'],
                ['Academics', 'programmes'],
                ['Admissions', 'admissions'],
                ['Departments', 'departments'],
                ['Hospital', 'hospital'],
                ['Research', 'research'],
                ['Notices', 'notices'],
                ['Student services', 'student-services'],
                ['Contact', 'contact'],
                ['Disclosures', 'disclosures'],
              ].map(([title, slug]) => (
                <Link key={slug} href={`/institution/${slug}`}>
                  {title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2>Policies</h2>
            <Link href="/institution/policies">Terms & content use</Link>
            <Link href="/institution/privacy">Privacy policy</Link>
            <Link href="/institution/accessibility">Accessibility statement</Link>
            <Link href="/institution/sitemap">Website sitemap</Link>
            <Link href="/institution/grievance">Grievance & anti-ragging</Link>
          </div>
          <div>
            <h2>This is a demonstration site</h2>
            <p>
              Synthetic institution and content. This website is a fictional example for
              demonstration. It does not represent a real medical college.
            </p>
            <p className="college-owner">
              Content owner: demonstration website team.
              <br />
              Verified institutional contacts pending.
            </p>
          </div>
        </div>
        <div className="college-width college-footer-bottom">
          <span>© 2026 Medora Medical College · Demonstration</span>
          <div>
            <Link href="/institution/sitemap">Sitemap</Link>
            <Link href="/institution/accessibility">Accessibility</Link>
            <Link href="/institution/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
