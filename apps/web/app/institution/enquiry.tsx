'use client';
import { useState } from 'react';
export default function Enquiry() {
  const [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setBusy(true);
        setError('');
        setMessage('');
        try {
          const response = await fetch('/api/v1/public/enquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(data)),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error?.message || 'Could not save enquiry.');
          setMessage(
            `Enquiry saved. Reference: ${result.reference}. Email delivery is not configured in this preview.`,
          );
          form.reset();
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Send an enquiry</h2>
      <div className="form-grid">
        <div>
          <label htmlFor="enquiry-name">Name</label>
          <input id="enquiry-name" name="name" required maxLength={150} />
        </div>
        <div>
          <label htmlFor="enquiry-email">Email</label>
          <input id="enquiry-email" name="email" type="email" required />
        </div>
        <div className="form-field wide">
          <label htmlFor="enquiry-message">Message</label>
          <textarea id="enquiry-message" name="message" required minLength={10} maxLength={2000} />
        </div>
      </div>
      {message && (
        <p role="status" className="inline-success">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="inline-error">
          {error}
        </p>
      )}
      <button className="primary" disabled={busy}>
        {busy ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
