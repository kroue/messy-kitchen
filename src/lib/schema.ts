import { SITE } from '../config/site';
import { branches, directionsUrl, type Branch } from '../data/branches';
import { categories, itemsIn } from '../data/menu';
import type { Faq } from '../data/faq';

/** Structured data (JSON-LD) builders. */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const abs = (site: URL | string, path: string) => new URL(path, site).href;

export function organization(site: URL | string) {
  return {
    '@type': 'Organization',
    '@id': abs(site, '/#organization'),
    name: SITE.name,
    url: abs(site, '/'),
    logo: abs(site, '/logo.png'),
    email: SITE.email,
    foundingDate: String(SITE.foundingYear),
    sameAs: [SITE.social.facebook, SITE.social.instagram],
    department: branches.map((b) => ({ '@id': abs(site, `/branches/${b.slug}/#bakery`) })),
  };
}

export function bakery(site: URL | string, b: Branch) {
  return {
    '@type': ['Bakery', 'CafeOrCoffeeShop'],
    '@id': abs(site, `/branches/${b.slug}/#bakery`),
    name: b.fullName,
    url: abs(site, `/branches/${b.slug}/`),
    image: abs(site, `/og/branch-${b.slug}.png`),
    logo: abs(site, '/logo.png'),
    telephone: b.phoneIntl,
    email: SITE.email,
    priceRange: '₱₱',
    servesCuisine: ['Bakery', 'Desserts', 'Coffee'],
    acceptsReservations: 'True',
    hasMenu: abs(site, '/menu/'),
    parentOrganization: { '@id': abs(site, '/#organization') },
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.street,
      addressLocality: b.locality,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode,
      addressCountry: SITE.country,
    },
    ...(b.geo ? { geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng } } : {}),
    hasMap: directionsUrl(b),
    openingHoursSpecification: b.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => DAY_NAMES[d]),
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [SITE.social.facebook, SITE.social.instagram],
  };
}

export function menuSchema(site: URL | string) {
  return {
    '@type': 'Menu',
    '@id': abs(site, '/menu/#menu'),
    name: `${SITE.name} Menu`,
    url: abs(site, '/menu/'),
    inLanguage: SITE.lang,
    hasMenuSection: categories.map((c) => ({
      '@type': 'MenuSection',
      name: c.label,
      description: c.blurb,
      hasMenuItem: itemsIn(c.id).map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        ...(item.price != null
          ? { offers: { '@type': 'Offer', price: item.price, priceCurrency: 'PHP' } }
          : {}),
      })),
    })),
  };
}

export function faqPage(items: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbList(site: URL | string, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(site, c.path),
    })),
  };
}
