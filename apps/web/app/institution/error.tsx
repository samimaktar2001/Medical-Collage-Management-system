'use client';
import Link from 'next/link';
export default function WebsiteError() {
  return (
    <main id="main-content" className="college-width college-interior">
      <h1>College information is temporarily unavailable</h1>
      <p>We could not load published information. Please try loading the page again.</p>
      <button className="college-button" onClick={() => window.location.reload()}>
        Try again
      </button>
      <p>
        <Link href="/">Open the college portal</Link>
      </p>
    </main>
  );
}
