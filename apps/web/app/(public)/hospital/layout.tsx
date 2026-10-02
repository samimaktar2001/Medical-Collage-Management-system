import type { Metadata } from 'next';

const origin = process.env.APP_ORIGIN || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Hospital & Clinical Services',
  description: 'Discover the advanced clinical facilities and healthcare services provided by Medora Medical College Hospital. We offer patient-centric care across multiple specialties.',
  openGraph: {
    title: 'Hospital & Clinical Services - Medora Medical College',
    description: 'Discover the advanced clinical facilities and healthcare services provided by Medora Medical College Hospital. We offer patient-centric care across multiple specialties.',
    images: [
      {
        url: `${origin}/images/medical-team.jpg`,
        width: 1200,
        height: 630,
        alt: 'Medora Medical College Hospital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hospital & Clinical Services - Medora Medical College',
    description: 'Discover the advanced clinical facilities and healthcare services provided by Medora Medical College Hospital.',
    images: [`${origin}/images/medical-team.jpg`],
  }
};

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
