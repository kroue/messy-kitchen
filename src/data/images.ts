import type { ImageMetadata } from 'astro';
import type { IconName } from '../components/icons';

/**
 * PHOTOS
 * ------
 * Every photo on the site comes from this file.
 *
 * These are royalty-free Unsplash stand-ins for the demo.
 * SWAP FOR THEIR OWN PHOTOS before launch:
 *   1. Drop the photo in src/assets/photos/ (e.g. tres-leches.jpg)
 *   2. import tresLeches from '../assets/photos/tres-leches.jpg';
 *   3. Set `src: tresLeches` below. Width/height are then read from the file.
 *
 * `fallback` is the line illustration shown while the photo loads,
 * or instead of it if the photo ever fails.
 */

export interface Photo {
  src: string | ImageMetadata | null;
  alt: string;
  /** Intrinsic size used for remote photos (aspect ratio of the crop). */
  width: number;
  height: number;
  fallback: IconName;
}

const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?fit=crop&crop=entropy&w=${w}&h=${h}&q=80`;

export const photos = {
  // TODO: swap for a photo of their Nazareth café interior.
  cafe: {
    src: unsplash('photo-1554118811-1e0d58224f24', 1600, 1200),
    alt: 'A calm, light-filled café interior with wooden tables',
    width: 1600,
    height: 1200,
    fallback: 'cup',
  },
  // TODO: swap for their own café photo (counter or wall sign).
  cafeCorner: {
    src: unsplash('photo-1501339847302-ac426a4a7cbb', 1200, 1500),
    alt: 'A quiet café corner with coffee on the table',
    width: 1200,
    height: 1500,
    fallback: 'whisk',
  },
  // TODO: swap for their Cookie Butter Tres Leches.
  tresLeches: {
    src: unsplash('photo-1565958011703-44f9829ba187', 1200, 1200),
    alt: 'A slice of creamy cake on a plate',
    width: 1200,
    height: 1200,
    fallback: 'slice',
  },
  // TODO: swap for their Double Dark Chocolate Cookie.
  cookies: {
    src: unsplash('photo-1499636136210-6f4ee915583e', 1200, 1200),
    alt: 'A stack of chocolate cookies',
    width: 1200,
    height: 1200,
    fallback: 'cookie',
  },
  // TODO: swap for their cookie box / pasalubong box.
  cookieBox: {
    src: unsplash('photo-1558961363-fa8fdf82db35', 1200, 900),
    alt: 'Freshly baked cookies ready to pack',
    width: 1200,
    height: 900,
    fallback: 'bag',
  },
  // TODO: swap for their Cereal Milk Matcha.
  matcha: {
    src: unsplash('photo-1515823064-d6e0c04616a7', 1200, 1200),
    alt: 'An iced matcha latte',
    width: 1200,
    height: 1200,
    fallback: 'matcha',
  },
  // TODO: swap for their matcha latte.
  matchaLatte: {
    src: unsplash('photo-1536256263959-770b48d82b0a', 1200, 1200),
    alt: 'A matcha latte seen from above',
    width: 1200,
    height: 1200,
    fallback: 'matcha',
  },
  // TODO: swap for their Cookie Butter Latte.
  coffee: {
    src: unsplash('photo-1509042239860-f550ce710b93', 1200, 1200),
    alt: 'A latte in a ceramic cup',
    width: 1200,
    height: 1200,
    fallback: 'cup',
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
