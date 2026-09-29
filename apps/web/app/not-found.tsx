import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="error-page">
      <h1>Page not found</h1>
      <p>The page may have moved or may not be published.</p>
      <Link href="/">Return to workspace</Link>
    </main>
  );
}
