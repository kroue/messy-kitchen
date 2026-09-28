import type { Accent, BranchSlug } from './branches';

/**
 * LIMITED DROPS
 * -------------
 * Each drop shows on the home page between `start` and `end` (inclusive,
 * Philippine time). Both are optional: leave them out and the drop shows
 * until you delete it. When nothing is active, the whole strip disappears.
 * An `end` date is shown to visitors ("until Oct 31"), so only add one the
 * café has actually announced.
 *
 * To add a drop: copy an entry, change the dates (YYYY-MM-DD) and text.
 * `menuItemId` is optional; when it points to a reservable whole cake, the
 * drop links straight to the reservation form with that cake selected.
 *
 * TODO-confirm: whether Banana Pudding is currently available, and its end date if any.
 */

export interface Drop {
  id: string;
  title: string;
  description: string;
  start?: string; // YYYY-MM-DD, inclusive
  end?: string; // YYYY-MM-DD, inclusive
  menuItemId?: string;
  branches?: BranchSlug[];
  accent: Accent;
}

export const drops: Drop[] = [
  {
    id: 'banana-pudding',
    title: 'Limited: Banana Pudding',
    description: 'Ask for it at the counter while it lasts.',
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
