import type { Accent, BranchSlug } from './branches';

/**
 * LIMITED DROPS
 * -------------
 * Each drop shows on the home page only between `start` and `end` (inclusive,
 * Philippine time). When nothing is active, the whole strip disappears.
 *
 * To add a drop: copy an entry, change the dates (YYYY-MM-DD) and text.
 * `menuItemId` is optional; when it points to a reservable whole cake, the
 * drop links straight to the reservation form with that cake selected.
 *
 * TODO-confirm: dates below are demo values. Replace with real drop dates.
 */

export interface Drop {
  id: string;
  title: string;
  description: string;
  start: string; // YYYY-MM-DD, inclusive
  end: string; // YYYY-MM-DD, inclusive
  menuItemId?: string;
  branches?: BranchSlug[];
  accent: Accent;
}

export const drops: Drop[] = [
  {
    id: 'banana-pudding-2026',
    title: 'Banana Pudding is back',
    description: 'Here for a short while only. Ask for it at the counter while it lasts.',
    start: '2026-09-15',
    end: '2026-10-31',
    menuItemId: 'banana-pudding',
    accent: 'cookie',
  },
  {
    id: 'peach-mango-higalaay-2026',
    title: 'Peach Mango Tres Leches',
    description: 'Our Higalaay special: yema, peaches, fresh mangoes and crunchy almonds.',
    start: '2026-08-01',
    end: '2026-08-31',
    menuItemId: 'peach-mango-tres-leches',
    accent: 'cookie',
  },
];
