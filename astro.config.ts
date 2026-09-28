import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/config/site';

// Canonical URLs, the sitemap and Open Graph links all come from `site`.
// Set SITE_URL in Vercel (or edit SITE.url) so they match the live domain.
// Accepts "example.ph" or "https://example.ph"; blank or invalid values fall back
// to Vercel's production domain, then to SITE.url.
function resolveSite(): string {
  const candidates = [process.env.SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, SITE.url];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      return url.origin;
    } catch {
      console.warn(`[site] Ignoring invalid site URL: "${value}"`);
    }
  }
  return SITE.url;
}
const site = resolveSite();

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel({
    // Photos go through Vercel Image Optimization (AVIF/WebP, resized per device).
    imageService: true,
    imagesConfig: {
      sizes: [320, 480, 640, 800, 1080, 1280, 1600],
      formats: ['image/avif', 'image/webp'],
      domains: ['images.unsplash.com'],
    },
  }),
  integrations: [
    sitemap({
      filter: (page) => !/\/(thank-you|404)\/?$/.test(page),
    }),
  ],
  image: {
    domains: ['images.unsplash.com'],
  },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      INQUIRY_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Sender must be on a domain verified in Resend. Falls back to Resend's test sender.
      RESEND_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Jost',
      cssVariable: '--font-jost',
      fallbacks: ['sans-serif'],
      display: 'swap',
      options: {
        variants: [
          { src: ['./src/assets/fonts/jost-latin-wght-normal.woff2'], weight: '300 500', style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      fallbacks: ['serif'],
      display: 'swap',
      options: {
        variants: [
          { src: ['./src/assets/fonts/newsreader-latin-400-normal.woff2'], weight: 400, style: 'normal' },
          { src: ['./src/assets/fonts/newsreader-latin-400-italic.woff2'], weight: 400, style: 'italic' },
          { src: ['./src/assets/fonts/newsreader-latin-500-normal.woff2'], weight: 500, style: 'normal' },
        ],
      },
    },
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    plugins: [tailwindcss()],
  },
});
