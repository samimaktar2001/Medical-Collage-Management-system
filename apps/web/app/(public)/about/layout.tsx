import type { Metadata } from 'next';

const origin = process.env.APP_ORIGIN || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Medora Medical College, our history, mission, vision, and the core values that drive our commitment to excellence in medical education and healthcare.',
  openGraph: {
    title: 'About Us - Medora Medical College',
    description: 'Learn about Medora Medical College, our history, mission, vision, and the core values that drive our commitment to excellence in medical education and healthcare.',
    images: [
      {
        url: `${origin}/images/medical-team.jpg`,
        width: 1200,
        height: 630,
        alt: 'Medora Medical College Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Medora Medical College',
    description: 'Learn about Medora Medical College, our history, mission, vision, and the core values that drive our commitment to excellence in medical education and healthcare.',
    images: [`${origin}/images/medical-team.jpg`],
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
