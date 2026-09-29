import 'server-only';
export type PageContent = {
  slug: string;
  title: string;
  body: string;
  language: string;
  kind: string;
  published_at: string;
  review_date: string;
  metadata: {
    category?: string;
    issue_date?: string;
    reference?: string;
    available_on?: string;
    archive_on?: string;
  };
  notice_state: 'Current' | 'Archived';
};
const apiBase = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
export async function publicPages(slug?: string, language = 'en', q = ''): Promise<PageContent[]> {
  const query = new URLSearchParams({ language, q });
  if (slug) query.set('slug', slug);
  const response = await fetch(`${apiBase}/api/v1/public/content?${query}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Public content service is unavailable.');
  return (await response.json()).items;
}
