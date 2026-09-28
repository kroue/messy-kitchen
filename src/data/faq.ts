import { SITE } from '../config/site';

/**
 * FAQ
 * ---
 * Shown on /faq/ and published as FAQPage structured data.
 * `answer` is plain text (it goes into JSON-LD). Add an optional `link` for a button.
 *
 * TODO-confirm: every answer below with the owner before launch.
 */

export interface Faq {
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

export const faqs: Faq[] = [
  {
    question: 'How far ahead should I reserve a cake?',
    // TODO-confirm: the café's actual lead time for cakes.
    answer: "Reserve ahead so we can have your cake ready. We'll text you to confirm your pickup date.",
    link: { href: '/reserve/', label: 'Reserve a cake' },
  },
  {
    question: 'Can I add a dedication?',
    answer: `Yes. Add a short message (up to ${SITE.reservation.dedicationMaxLength} characters) in the reservation form and we'll take care of it.`,
  },
  {
    question: 'Do you deliver?',
    answer:
      'Reservations are for pickup at any of our three branches. For bulk and corporate orders, send us a delivery request and we will let you know what is possible.',
    link: { href: '/celebrations/', label: 'Bulk & corporate orders' },
  },
  {
    question: 'Which branch has soft serve?',
    answer: 'Cookie Butter Soft Serve is only at our Kauswagan branch, right before S&R on Kauswagan Highway.',
    link: { href: '/branches/kauswagan/', label: 'Kauswagan branch' },
  },
  {
    question: 'How do I pay?',
    answer:
      "After you reserve, we'll text you to confirm your order and send payment details. Nothing is charged on this website.",
  },
  {
    question: 'Do you do corporate orders?',
    answer:
      'Yes. Cookie boxes, cake bundles, office pantry orders and corporate gifts. Tell us the quantity, date and budget and we will send you options.',
    link: { href: '/celebrations/', label: 'Send an inquiry' },
  },
  {
    question: 'Where do I park in Nazareth?',
    answer: 'Street parking in front of the café when available.',
    link: { href: '/branches/nazareth/', label: 'Nazareth branch' },
  },
  {
    question: 'What are your hours?',
    answer: `All branches are open daily, ${SITE.hours.short}.`,
  },
];
