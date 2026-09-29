'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <h1>Something interrupted this page.</h1>
      <p>Your saved records are still available. Try loading the page again.</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
