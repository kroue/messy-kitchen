import type { Accent, BranchSlug } from './branches';
import type { IconName } from '../components/icons';

/**
 * MENU
 * ----
 * To add an item: copy an entry below, give it a unique `id` (lowercase, dashes),
 * pick a `category`, and set `price` to a number in pesos, or `null` to show "Ask for price".
 *
 * Whole cakes with `reservable: true` appear in the reservation form dropdown.
 *
 * TODO-confirm: every description below is a first draft. Confirm wording,
 * prices and which branches carry each item with the owner.
 */

export type CategoryId = 'whole-cakes' | 'slices' | 'cookies' | 'coffee' | 'matcha' | 'soft-serve';

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  icon: IconName;
}

export const categories: Category[] = [
  { id: 'whole-cakes', label: 'Whole Cakes', blurb: 'For birthdays, barkada nights and just because. Reserve ahead.', icon: 'cake' },
  { id: 'slices', label: 'Slices & Desserts', blurb: 'A little something with your coffee.', icon: 'slice' },
  { id: 'cookies', label: 'Cookies', blurb: 'The ones our reviews keep talking about.', icon: 'cookie' },
  { id: 'coffee', label: 'Coffee', blurb: 'Coffee, the Messy Kitchen way.', icon: 'cup' },
  { id: 'matcha', label: 'Matcha & Non-Coffee', blurb: 'Creamy, earthy, and nothing to wake you up too much.', icon: 'matcha' },
  { id: 'soft-serve', label: 'Soft Serve', blurb: 'Only at our Kauswagan branch.', icon: 'softserve' },
];

export type Tag = 'bestseller' | 'limited' | 'exclusive';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  /** Pesos. `null` renders "Ask for price". */
  price: number | null;
  /** e.g. "whole cake" — shown after the price. */
  unit?: string;
  branches: BranchSlug[];
  tags?: Tag[];
  /** Short note shown with the "Limited" tag, e.g. the season it runs. */
  limitedNote?: string;
  /** Show in the reservation dropdown (whole cakes only). */
  reservable?: boolean;
  accent?: Accent;
  icon: IconName;
}

const ALL: BranchSlug[] = ['nazareth', 'ayala-centrio', 'kauswagan'];

export const menu: MenuItem[] = [
  // ── Whole cakes ────────────────────────────────────────────────
  {
    id: 'cookie-butter-tres-leches',
    name: 'Cookie Butter Tres Leches',
    category: 'whole-cakes',
    // TODO-confirm description
    description: 'Our tres leches, soaked and milky, finished with cookie butter.',
    price: 1200,
    unit: 'whole cake',
    branches: ALL,
    tags: ['bestseller'],
    reservable: true,
    accent: 'cookie',
    icon: 'cake',
  },
  {
    id: 'creme-caramel-tres-leches',
    name: 'Crème Caramel Tres Leches',
    category: 'whole-cakes',
    // TODO-confirm description and price
    description: 'Milky tres leches meets crème caramel.',
    price: null,
    unit: 'whole cake',
    branches: ALL,
    reservable: true,
    accent: 'cookie',
    icon: 'cake',
  },
  {
    id: 'ube-cake',
    name: 'Ube Cake',
    category: 'whole-cakes',
    // TODO-confirm description and price
    description: 'A whole cake made with ube, the Filipino favorite.',
    price: null,
    unit: 'whole cake',
    branches: ALL,
    reservable: true,
    accent: 'ube',
    icon: 'cake',
  },
  {
    id: 'peach-mango-tres-leches',
    name: 'Peach Mango Tres Leches',
    category: 'whole-cakes',
    // Description is from their own Higalaay post.
    description: 'Soft, milky tres leches with yema and peaches, topped with fresh mangoes and crunchy almonds.',
    price: null,
    unit: 'whole cake',
    branches: ALL,
    tags: ['limited'],
    limitedNote: 'Higalaay special',
    // TODO-confirm: set to true whenever it is back as a limited drop.
    reservable: false,
    accent: 'cookie',
    icon: 'cake',
  },

  // ── Slices & desserts ─────────────────────────────────────────
  {
    id: 'cookie-butter-tres-leches-slice',
    name: 'Cookie Butter Tres Leches, Slice',
    category: 'slices',
    // TODO-confirm: which tres leches flavors are sold by the slice.
    description: 'The bestseller, one slice at a time.',
    price: null,
    branches: ALL,
    accent: 'cookie',
    icon: 'slice',
  },
  {
    id: 'banana-pudding',
    name: 'Banana Pudding',
    category: 'slices',
    // TODO-confirm description, price and when it returns.
    description: 'Banana pudding, the way we like it. Here for a limited time.',
    price: null,
    branches: ALL,
    tags: ['limited'],
    accent: 'cookie',
    icon: 'pudding',
  },

  // ── Cookies ───────────────────────────────────────────────────
  {
    id: 'double-dark-chocolate-cookie',
    name: 'Double Dark Chocolate Cookie',
    category: 'cookies',
    // TODO-confirm description and price
    description: 'Double the dark chocolate. Rich and chocolatey.',
    price: null,
    branches: ALL,
    tags: ['bestseller'],
    icon: 'cookie',
  },
  {
    id: 'matcha-white-chocolate-cookie',
    name: 'Matcha White Chocolate Cookie',
    category: 'cookies',
    // TODO-confirm description and price
    description: 'Matcha cookie with white chocolate.',
    price: null,
    branches: ALL,
    accent: 'matcha',
    icon: 'cookie',
  },

  // ── Coffee ────────────────────────────────────────────────────
  {
    id: 'iced-tres-leches',
    name: 'Iced Tres Leches',
    category: 'coffee',
    // TODO-confirm: is this a coffee drink? Description and price.
    description: 'Our favorite cake, as an iced drink.',
    price: null,
    branches: ALL,
    tags: ['bestseller'],
    accent: 'cookie',
    icon: 'iced',
  },
  {
    id: 'cookie-butter-latte',
    name: 'Cookie Butter Latte',
    category: 'coffee',
    // TODO-confirm description and price
    description: 'A latte with cookie butter. Sweet and cozy.',
    price: null,
    branches: ALL,
    accent: 'cookie',
    icon: 'cup',
  },

  // ── Matcha & non-coffee ───────────────────────────────────────
  {
    id: 'cereal-milk-matcha',
    name: 'Cereal Milk Matcha',
    category: 'matcha',
    // TODO-confirm description and price
    description: 'Matcha over cereal milk. Nostalgic and creamy.',
    price: null,
    branches: ALL,
    tags: ['bestseller'],
    accent: 'matcha',
    icon: 'iced',
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'matcha',
    // TODO-confirm description and price
    description: 'Matcha and milk, simple and smooth.',
    price: null,
    branches: ALL,
    accent: 'matcha',
    icon: 'matcha',
  },
  {
    id: 'iced-cereal-milk',
    name: 'Iced Cereal Milk',
    category: 'matcha',
    // TODO-confirm description and price
    description: 'Cereal milk over ice. No coffee, all comfort.',
    price: null,
    branches: ALL,
    icon: 'iced',
  },

  // ── Soft serve ────────────────────────────────────────────────
  {
    id: 'cookie-butter-soft-serve',
    name: 'Cookie Butter Soft Serve',
    category: 'soft-serve',
    // TODO-confirm description and price
    description: 'Cookie butter soft serve. Only at Kauswagan.',
    price: null,
    branches: ['kauswagan'],
    tags: ['exclusive'],
    accent: 'cookie',
    icon: 'softserve',
  },
];

export const menuById = (id: string) => menu.find((m) => m.id === id);
export const itemsIn = (category: CategoryId) => menu.filter((m) => m.category === category);
export const reservableCakes = () => menu.filter((m) => m.category === 'whole-cakes' && m.reservable);

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
export const formatPrice = (price: number | null) => (price == null ? 'Ask for price' : peso.format(price));
