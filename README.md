# The Messy Kitchen: website

Marketing site for **The Messy Kitchen**, café & bakery in Cagayan de Oro City (baking since 2018, three branches).

- **Astro 7** (static output) + **Tailwind CSS 4** + TypeScript
- **Vercel** adapter. Every page is prerendered HTML; the only server code is `POST /api/inquiry/` for the two forms.
- Self-hosted fonts (Jost + Newsreader), Vercel Image Optimization (AVIF/WebP), about 2.5 KB of JavaScript in total.
- Lighthouse (mobile, local production build): Performance 98–99, Accessibility 100, Best Practices 100, SEO 100 with `DEMO_MODE` off.

## Setup

Needs Node 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type-checks, then builds to .vercel/output
```

Deploy by importing the repo in Vercel. The framework is detected automatically, so no extra config is needed.

> Photos go through Vercel's image optimizer (`/_vercel/image`). In `npm run dev` they are processed locally with sharp.

## Environment variables

Copy `.env.example` to `.env` for local work, and add the same keys in **Vercel → Project → Settings → Environment Variables**.

| Variable           | Required | What it does                                                                                             |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`   | for email | API key from [resend.com](https://resend.com).                                                          |
| `INQUIRY_TO_EMAIL` | for email | Where reservations and inquiries go. Comma-separate multiple addresses.                                 |
| `RESEND_FROM`      | no       | Sender, e.g. `The Messy Kitchen <orders@yourdomain.ph>`. Domain must be verified in Resend. Defaults to Resend's test sender. |
| `SITE_URL`         | no       | Live domain, e.g. `https://themessykitchen.ph`. Overrides `SITE.url` for canonicals, sitemap and OG tags. |

**Demo mode for forms:** if `RESEND_API_KEY` or `INQUIRY_TO_EMAIL` is missing, the forms still validate and show the success message (plus a small "Demo mode" note), but no email is sent.

## Where to edit content

All editable content lives in `src/config` and `src/data`. You shouldn't need to touch the pages.

| File                         | What's in it                                                            |
| ---------------------------- | ----------------------------------------------------------------------- |
| `src/config/site.ts`         | Name, tagline, email, socials, hours, reservation rules, **DEMO_MODE**  |
| `src/data/branches.ts`       | Branch addresses, phones, hours, coordinates, parking, exclusives, SEO  |
| `src/data/menu.ts`           | Menu categories and items, prices                                       |
| `src/data/drops.ts`          | Limited drops on the home page                                          |
| `src/data/faq.ts`            | FAQ (also published as FAQPage structured data)                         |
| `src/data/reviews.json`      | Review excerpts                                                         |
| `src/data/celebrations.ts`   | Corporate offers, occasion and budget options                           |
| `src/data/images.ts`         | Every photo on the site                                                 |

Search the code for `TODO-confirm` to find the details that still need the owner's confirmation. These are code comments only and never show on the site.

### Add a menu item

In `src/data/menu.ts`, copy an entry and change it:

```ts
{
  id: 'ube-cheese-cookie',          // unique, lowercase, dashes
  name: 'Ube Cheese Cookie',
  category: 'cookies',              // whole-cakes | slices | cookies | coffee | matcha | soft-serve
  description: 'Short and sweet.',
  price: 95,                        // pesos, or null for "Ask for price"
  branches: ['nazareth', 'kauswagan'],
  tags: ['bestseller'],             // optional: bestseller | limited | exclusive
  accent: 'ube',                    // optional: matcha | cookie | ube
  icon: 'cookie',                   // line illustration, see src/components/icons.ts
},
```

For whole cakes, add `unit: 'whole cake'` and `reservable: true` so the cake shows up in the reservation form and gets a "Reserve this cake" button.

### Add a limited drop

In `src/data/drops.ts`:

```ts
{
  id: 'ube-week-2026',
  title: 'Ube week',
  description: 'Ube everything, for seven days only.',
  start: '2026-11-03',   // inclusive, Philippine time
  end: '2026-11-09',     // inclusive
  menuItemId: 'ube-cake', // optional: links the drop to that item (or its reservation)
  accent: 'ube',
},
```

A drop only shows between its start and end dates. When no drop is active, the strip disappears. Dates are checked at build time and again in the visitor's browser, so drops switch on and off on schedule without a redeploy.

### Swap the stock photos for real ones

The demo uses Unsplash stand-ins. For each entry in `src/data/images.ts`:

1. Put the photo in `src/assets/photos/`, e.g. `tres-leches.jpg`.
2. Import it at the top: `import tresLeches from '../assets/photos/tres-leches.jpg';`
3. Set `src: tresLeches`. Width and height are read from the file automatically.

If a photo is missing or fails to load, a line illustration in the brand style shows in its place.

### Open Graph images

The share images in `public/og/` are generated from the brand fonts and logo. After changing titles or branches, run:

```bash
npm run og
```

## Before launch

1. **Turn off DEMO_MODE.** In `src/config/site.ts`, set `export const DEMO_MODE = false;`. This removes `noindex, nofollow` from every page and removes the "Preview by Kuro" strip.
2. Set the real domain: `SITE.url` in `src/config/site.ts`, or `SITE_URL` in Vercel.
3. Add `RESEND_API_KEY` and `INQUIRY_TO_EMAIL` in Vercel. Verify the sending domain in Resend and set `RESEND_FROM`.
4. Replace the Unsplash photos with the café's own (see above).
5. Resolve the `TODO-confirm` comments: prices, descriptions, Ayala Centrio kiosk location, hours and coordinates, the About story, FAQ answers, and the Privacy Policy's Data Protection Officer.
6. Submit `https://<domain>/sitemap-index.xml` in Google Search Console, and link the site from the Google Business Profiles for each branch.

> While DEMO_MODE is on, Lighthouse's SEO score shows about 69 because the preview is deliberately `noindex`. It returns to 100 once DEMO_MODE is off.

## Project structure

```
src/
  config/site.ts          business details + DEMO_MODE
  data/                   menu, branches, drops, FAQ, reviews, photos
  components/             UI pieces (Icon, Photo, BranchCard, MenuItemCard, FormShell…)
  layouts/BaseLayout.astro  <head>, SEO tags, JSON-LD, header/footer
  lib/                    JSON-LD builders, time helpers (Asia/Manila), form validation
  pages/                  routes (+ api/inquiry.ts, robots.txt.ts)
  scripts/forms.ts        form enhancement (inline errors, date limits, prefill)
  styles/global.css       design tokens (@theme) and base styles
scripts/generate-og.mjs   Open Graph image generator
```
