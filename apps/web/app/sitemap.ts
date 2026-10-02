import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_ORIGIN || 'http://localhost:3000';
  
  const routes = [
    '',
    '/about',
    '/admissions',
    '/appointment',
    '/contact',
    '/courses',
    '/departments',
    '/doctors',
    '/facilities',
    '/gallery',
    '/hospital',
    '/news',
    '/notices',
    '/research'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
