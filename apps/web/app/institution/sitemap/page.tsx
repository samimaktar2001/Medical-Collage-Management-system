import Link from 'next/link';
import { publicPages } from '../content';
export const dynamic = 'force-dynamic';
export default async function Sitemap() {
  const pages = (await publicPages()).filter((p) => p.slug !== 'home-introduction');
  return (
    <main id="main-content" tabIndex={-1} className="college-width college-interior">
      <span className="college-eyebrow">FIND YOUR WAY</span>
      <h1>Website sitemap</h1>
      <p>Published pages and notices. Private portal records are not included.</p>
      <ul className="college-sitemap">
        <li>
          <Link href="/institution">Home</Link>
        </li>
        {pages.map((p) => (
          <li key={p.slug}>
            <Link href={`/institution/${p.slug}`}>{p.title}</Link>
            <span>{p.kind}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
