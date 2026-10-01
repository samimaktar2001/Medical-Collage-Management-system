import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_ORIGIN || 'http://localhost:3000';
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    }
  ];
}
