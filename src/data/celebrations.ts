import type { Accent } from './branches';
import type { IconName } from '../components/icons';

/**
 * Celebrations & Corporate page content and inquiry form options.
 * TODO-confirm: offers, minimums and lead times with the owner.
 */

export interface Offer {
  title: string;
  text: string;
  icon: IconName;
  accent: Accent;
}

export const offers: Offer[] = [
  {
    title: 'Cookie boxes',
    text: 'Boxes of our cookies for giveaways, client gifts and pasalubong. Mix flavors or keep it classic.',
    icon: 'gift',
    accent: 'cookie',
  },
  {
    title: 'Cake bundles',
    text: 'Several whole tres leches cakes for birthdays, reunions and team celebrations.',
    icon: 'cake',
    accent: 'ube',
  },
  {
    title: 'Office pantry',
    text: 'Cookies and treats for meetings, trainings and the Friday merienda.',
    icon: 'cup',
    accent: 'matcha',
  },
];

export const occasions = [
  'Birthday or family party',
  'Corporate gifts',
  'Office pantry or meeting',
  'Wedding or debut',
  'Giveaways or souvenirs',
  'Something else',
] as const;

export const budgets = [
  'Under ₱5,000',
  '₱5,000 – ₱10,000',
  '₱10,000 – ₱25,000',
  '₱25,000 and up',
  'Not sure yet',
] as const;
