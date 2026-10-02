import type { Metadata } from 'next';

const origin = process.env.APP_ORIGIN || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Admissions',
  description: 'Apply for undergraduate and postgraduate medical programmes at Medora Medical College. View admission requirements, eligibility criteria, and important dates.',
  openGraph: {
    title: 'Admissions - Medora Medical College',
    description: 'Apply for undergraduate and postgraduate medical programmes at Medora Medical College. View admission requirements, eligibility criteria, and important dates.',
    images: [
      {
        url: `${origin}/images/campus-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Admissions at Medora Medical College',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admissions - Medora Medical College',
    description: 'Apply for undergraduate and postgraduate medical programmes at Medora Medical College.',
    images: [`${origin}/images/campus-hero.jpg`],
  }
};

export default function AdmissionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
