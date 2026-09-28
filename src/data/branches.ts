import { SITE } from '../config/site';

export type BranchSlug = 'nazareth' | 'ayala-centrio' | 'kauswagan';
export type Accent = 'matcha' | 'cookie' | 'ube';

/** 0 = Sunday … 6 = Saturday */
export interface OpeningHours {
  days: number[];
  opens: string; // 24h "HH:MM", Asia/Manila
  closes: string;
}

export interface Branch {
  slug: BranchSlug;
  name: string;
  /** Used in titles and JSON-LD. */
  fullName: string;
  kind: string;
  street: string;
  locality: string;
  phone: string;
  phoneIntl: string;
  hours: OpeningHours[];
  hoursLabel: string;
  geo: { lat: number; lng: number } | null;
  /** Used for the directions link when there are no coordinates. */
  mapsQuery: string;
  parking: string;
  /** Short line for cards. */
  blurb: string;
  /** Longer copy for the branch page. */
  intro: string[];
  /** Menu item ids that are only sold at this branch. */
  exclusives: string[];
  /** Menu item ids to feature on the branch page. */
  picks: string[];
  accent: Accent;
  seo: { title: string; description: string };
}

const daily = (opens: string = SITE.hours.opens, closes: string = SITE.hours.closes): OpeningHours[] => [
  { days: [0, 1, 2, 3, 4, 5, 6], opens, closes },
];

export const branches: Branch[] = [
  {
    slug: 'nazareth',
    name: 'Nazareth',
    fullName: 'The Messy Kitchen Nazareth',
    kind: 'Café & bakery',
    street: '9th–16th Street, Nazareth',
    locality: SITE.city,
    phone: '0995 313 9739',
    phoneIntl: '+639953139739',
    hours: daily(),
    hoursLabel: SITE.hours.label,
    geo: { lat: 8.469984, lng: 124.6459605 },
    mapsQuery: 'The Messy Kitchen Nazareth Cagayan de Oro',
    parking: 'Street parking in front when available.',
    blurb: 'Our quiet café in Nazareth. Stay for a coffee and a slice.',
    // TODO-confirm: branch story and seating details.
    intro: [
      'A calm little café on a Nazareth side street. Big windows, clean lines, and the smell of something coming out of the oven.',
      'Come for a slow coffee, a slice of tres leches, or a cookie to go. Laptops, long talks and quiet afternoons are all welcome.',
    ],
    exclusives: [],
    picks: ['cookie-butter-tres-leches', 'double-dark-chocolate-cookie', 'cereal-milk-matcha'],
    accent: 'matcha',
    seo: {
      title: 'Café in Nazareth, CDO | The Messy Kitchen Nazareth',
      description:
        'A quiet café in Nazareth, Cagayan de Oro for tres leches, cookies, matcha and coffee. Open daily 9 AM to 8 PM. Address, parking and directions.',
    },
  },
  {
    slug: 'ayala-centrio',
    name: 'Ayala Centrio',
    fullName: 'The Messy Kitchen Ayala Centrio',
    kind: 'Mall kiosk',
    // TODO-confirm: exact kiosk location inside the mall (floor / wing / nearest landmark).
    street: 'Kiosk, Ayala Malls Centrio, C.M. Recto Avenue',
    locality: SITE.city,
    phone: '0975 404 0639',
    phoneIntl: '+639754040639',
    // TODO-confirm: kiosk hours. May follow mall hours instead of 9 AM – 8 PM.
    hours: daily(),
    hoursLabel: SITE.hours.label,
    // TODO-confirm: kiosk coordinates. Until then, directions use a search for the mall.
    geo: null,
    mapsQuery: 'Ayala Malls Centrio Cagayan de Oro',
    parking: 'Park at the Ayala Malls Centrio parking areas.',
    blurb: 'Grab-and-go cookies and drinks inside Ayala Malls Centrio.',
    intro: [
      'Our kiosk at Ayala Malls Centrio is made for quick stops: a cookie while shopping, an iced drink for the walk, or a cake pickup on your way home.',
      'Reserve ahead and pick up your cake here. No need to cross town.',
    ],
    exclusives: [],
    picks: ['matcha-white-chocolate-cookie', 'iced-tres-leches', 'cookie-butter-latte'],
    accent: 'ube',
    seo: {
      title: 'Centrio Café Kiosk | The Messy Kitchen at Ayala Centrio',
      description:
        'Find The Messy Kitchen kiosk at Ayala Malls Centrio, Cagayan de Oro. Cookies, iced drinks and cake pickups. Hours, phone and directions.',
    },
  },
  {
    slug: 'kauswagan',
    name: 'Kauswagan',
    fullName: 'The Messy Kitchen Kauswagan',
    kind: 'Café & pasalubong stop',
    street: 'Neocentral Arcade, Kauswagan Highway (right before S&R)',
    locality: SITE.city,
    phone: '0955 681 7138',
    phoneIntl: '+639556817138',
    hours: daily(),
    hoursLabel: SITE.hours.label,
    geo: { lat: 8.5028342, lng: 124.6272389 },
    mapsQuery: 'Neocentral Arcade Kauswagan Cagayan de Oro',
    // TODO-confirm: parking details at Neocentral Arcade.
    parking: 'Parking at Neocentral Arcade.',
    blurb: 'Right before S&R. Your pasalubong stop on the way to the airport.',
    intro: [
      'Right before S&R on Kauswagan Highway, and right on the way to the airport. Pick up cookies and cakes for the people waiting for you back home.',
      'This is also the only branch with Cookie Butter Soft Serve. Worth the stop.',
    ],
    exclusives: ['cookie-butter-soft-serve'],
    picks: ['cookie-butter-tres-leches', 'double-dark-chocolate-cookie', 'matcha-white-chocolate-cookie'],
    accent: 'cookie',
    seo: {
      title: 'Café in Kauswagan CDO | Pasalubong Stop to the Airport',
      description:
        'The Messy Kitchen Kauswagan, right before S&R. Pasalubong cookies and tres leches on the way to the airport, plus Cookie Butter Soft Serve. Open daily.',
    },
  },
];

export const branchBySlug = (slug: string) => branches.find((b) => b.slug === slug);

export const directionsUrl = (b: Branch) =>
  b.geo
    ? `https://www.google.com/maps/dir/?api=1&destination=${b.geo.lat},${b.geo.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapsQuery)}`;

export const telUrl = (b: Branch) => `tel:${b.phoneIntl}`;
