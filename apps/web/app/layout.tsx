import type { Metadata } from 'next';
import './globals.css';
import './custom-select.css';
const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
export const metadata: Metadata = {
  title: {
    default: 'Medora Medical College',
    template: '%s · Medora Medical College',
  },
  description:
    'Official website of Medora Medical College. Academic programmes, admissions, examinations, student services and institutional information.',
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL(origin),
  openGraph: {
    type: 'website',
    siteName: 'Medora Medical College',
    title: 'Medora Medical College',
    description:
      'Academic programmes, admissions, examinations, student services and institutional information.',
    url: origin,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: 'Medora Medical College',
    description:
      'Academic programmes, admissions, examinations, student services and institutional information.',
  },
  robots: {
    index: false,
    follow: false,
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
