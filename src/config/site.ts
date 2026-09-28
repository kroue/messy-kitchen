/**
 * Single source of truth for business details.
 * Everything the site says about the business (name, contact, socials,
 * reservation rules) is read from here.
 */

/**
 * DEMO_MODE
 * true  → every page gets `noindex, nofollow` and a small "Preview by Kuro" badge.
 * false → the site is indexable and the badge disappears. Flip this before launch.
 */
export const DEMO_MODE = true;

export const SITE = {
  name: 'The Messy Kitchen',
  shortName: 'Messy Kitchen',
  tagline: 'café & bakery · Baking since 2018',
  foundingYear: 2018,

  // TODO-confirm: replace with the live domain before launch (or set SITE_URL in Vercel).
  url: 'https://themessykitchen.vercel.app',

  email: 'themessykitchenph@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/themessykitchenph/',
    instagram: 'https://www.instagram.com/themessykitchenph',
    messenger: 'https://m.me/themessykitchenph',
    instagramHandle: '@themessykitchenph',
  },

  locale: 'en_PH',
  lang: 'en-PH',
  timezone: 'Asia/Manila',
  city: 'Cagayan de Oro City',
  region: 'Misamis Oriental',
  postalCode: '9000',
  country: 'PH',

  /** Default daily hours, used by every branch unless it overrides them. */
  hours: { opens: '09:00', closes: '20:00', label: 'Daily, 9:00 AM – 8:00 PM', short: '9 AM – 8 PM' },

  reservation: {
    /** Earliest pickup is today + this many days (Asia/Manila). */
    minLeadDays: 2,
    /** How far ahead people can book. */
    maxLeadDays: 90,
    maxQuantity: 10,
    dedicationMaxLength: 40,
  },

  /** Shown on the "Preview by Kuro" badge while DEMO_MODE is on. */
  demoCredit: 'Preview by Kuro',
} as const;

export const NAV = [
  { href: '/menu/', label: 'Menu' },
  { href: '/reserve/', label: 'Reserve' },
  { href: '/branches/', label: 'Branches' },
  { href: '/celebrations/', label: 'Celebrations' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;
