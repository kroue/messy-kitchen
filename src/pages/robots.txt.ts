import type { APIRoute } from 'astro';

// Crawling stays allowed even in DEMO_MODE: the per-page `noindex` meta tag is what
// keeps the preview out of search results, and crawlers need to fetch pages to see it.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
