import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import ThemeRegistry from './ThemeRegistry';
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
    images: [
      {
        url: `${origin}/images/campus-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Medora Medical College Campus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medora Medical College',
    description:
      'Academic programmes, admissions, examinations, student services and institutional information.',
    images: [`${origin}/images/campus-hero.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['CollegeOrUniversity', 'MedicalOrganization'],
  name: 'Medora Medical College',
  url: origin,
  logo: `${origin}/favicon.svg`,
  description: 'Academic programmes, admissions, examinations, student services and institutional information.',
  sameAs: [
    'https://twitter.com/medoracollege',
    'https://facebook.com/medoracollege',
    'https://linkedin.com/school/medoracollege'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-1234567890',
    contactType: 'admissions',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
        <Toaster
          position="top-right"
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            style: {
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  );
}
