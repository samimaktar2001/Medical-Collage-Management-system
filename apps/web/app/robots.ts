import type { MetadataRoute } from 'next';
const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/portal/', '/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'Claude-Web',
          'ClaudeBot',
          'PerplexityBot',
          'anthropic-ai',
          'OAI-SearchBot',
        ],
        allow: ['/'],
        disallow: ['/portal/', '/api/'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
