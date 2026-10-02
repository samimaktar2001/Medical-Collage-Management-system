import type { Metadata } from 'next';

const origin = process.env.APP_ORIGIN || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Courses & Academic Programmes',
  description: 'Explore the diverse medical courses offered at Medora Medical College, including MBBS, MD, MS, and diploma programmes in various medical specialties.',
  openGraph: {
    title: 'Courses & Academic Programmes - Medora Medical College',
    description: 'Explore the diverse medical courses offered at Medora Medical College, including MBBS, MD, MS, and diploma programmes in various medical specialties.',
    images: [
      {
        url: `${origin}/images/campus-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Courses at Medora Medical College',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courses & Academic Programmes - Medora Medical College',
    description: 'Explore the diverse medical courses offered at Medora Medical College.',
    images: [`${origin}/images/campus-hero.jpg`],
  }
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
