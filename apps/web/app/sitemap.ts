import type { MetadataRoute } from 'next';
import { publicPages } from './institution/content';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await publicPages();
  return pages.map((p) => ({
    url: `${process.env.APP_ORIGIN || 'http://localhost:3000'}/institution/${p.slug}`,
    lastModified: p.published_at,
  }));
}
