import { SITE } from '../config/site';
import { branchBySlug } from '../data/branches';
import { budgets, occasions } from '../data/celebrations';
import { reservableCakes } from '../data/menu';
import { addDays } from './time';

/** Server-side validation for the reservation and corporate inquiry forms. */

export type InquiryType = 'reservation' | 'corporate';
export type Fields = Record<string, string>;
export type Validation = { ok: true; fields: Fields } | { ok: false; errors: Fields };

const get = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? '').trim().slice(0, max);

/** Accepts 09XXXXXXXXX, +639XXXXXXXXX or 639XXXXXXXXX (spaces and dashes allowed). Returns 09XXXXXXXXX. */
export function normalizeMobile(value: string): string | null {
  const digits = value.replace(/[\s\-().]/g, '');
  const m = digits.match(/^(?:\+?63|0)(9\d{9})$/);
  return m ? `0${m[1]}` : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function common(fd: FormData, errors: Fields): Fields {
  const name = get(fd, 'name', 80);
  if (name.length < 2) errors.name = 'Please enter your name.';
  const mobileRaw = get(fd, 'mobile', 30);
  const mobile = normalizeMobile(mobileRaw);
  if (!mobile) errors.mobile = 'Please enter a PH mobile number like 09171234567.';
  const email = get(fd, 'email', 120);
  if (email && !EMAIL.test(email)) errors.email = 'That email doesn’t look right.';
  if (fd.get('consent') !== 'yes') errors.consent = 'Please agree so we can use your details to reply.';
  return { name, mobile: mobile ?? mobileRaw, email };
}

function checkDate(value: string, today: string, errors: Fields, key: string) {
  const min = addDays(today, SITE.reservation.minLeadDays);
  const max = addDays(today, SITE.reservation.maxLeadDays);
  if (!ISO_DATE.test(value)) errors[key] = 'Please choose a date.';
  else if (value < min) errors[key] = `Please choose a date at least ${SITE.reservation.minLeadDays} days from today.`;
  else if (value > max) errors[key] = 'That date is a bit too far ahead. Message us and we’ll sort it out.';
}

export function validateReservation(fd: FormData, today: string): Validation {
  const errors: Fields = {};
  const base = common(fd, errors);

  const cakeId = get(fd, 'cake', 80);
  const cake = reservableCakes().find((c) => c.id === cakeId);
  if (!cake) errors.cake = 'Please choose a cake.';

  const qty = Number(get(fd, 'quantity', 3));
  if (!Number.isInteger(qty) || qty < 1 || qty > SITE.reservation.maxQuantity)
    errors.quantity = `Please enter 1 to ${SITE.reservation.maxQuantity}.`;

  const branch = branchBySlug(get(fd, 'branch', 40));
  if (!branch) errors.branch = 'Please choose a pickup branch.';

  const date = get(fd, 'date', 10);
  checkDate(date, today, errors, 'date');

  const dedication = String(fd.get('dedication') ?? '').trim();
  if (dedication.length > SITE.reservation.dedicationMaxLength)
    errors.dedication = `Please keep it to ${SITE.reservation.dedicationMaxLength} characters.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    fields: {
      ...base,
      cake: cake!.name,
      quantity: String(qty),
      branch: branch!.name,
      date,
      dedication,
      notes: get(fd, 'notes', 1000),
    },
  };
}

export function validateCorporate(fd: FormData, today: string): Validation {
  const errors: Fields = {};
  const base = common(fd, errors);

  const occasion = get(fd, 'occasion', 80);
  if (!(occasions as readonly string[]).includes(occasion)) errors.occasion = 'Please choose an option.';

  const quantity = get(fd, 'quantity', 120);
  if (!quantity) errors.quantity = 'Roughly how many? A guess is fine.';

  const date = get(fd, 'date', 10);
  checkDate(date, today, errors, 'date');

  const budget = get(fd, 'budget', 40);
  if (!(budgets as readonly string[]).includes(budget)) errors.budget = 'Please choose a budget range.';

  const fulfillment = get(fd, 'fulfillment', 20);
  let branchName = '';
  let address = '';
  if (fulfillment === 'pickup') {
    const branch = branchBySlug(get(fd, 'branch', 40));
    if (!branch) errors.branch = 'Please choose a pickup branch.';
    else branchName = branch.name;
  } else if (fulfillment === 'delivery') {
    address = get(fd, 'address', 300);
    if (address.length < 5) errors.address = 'Please tell us where to deliver.';
  } else {
    errors.fulfillment = 'Pickup or delivery?';
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    fields: {
      ...base,
      company: get(fd, 'company', 120),
      occasion,
      quantity,
      date,
      budget,
      fulfillment: fulfillment === 'pickup' ? `Pickup at ${branchName}` : 'Delivery request',
      address,
      message: get(fd, 'message', 1500),
    },
  };
}

const LABELS: Record<string, string> = {
  cake: 'Cake',
  quantity: 'Quantity',
  branch: 'Pickup branch',
  date: 'Date',
  dedication: 'Dedication',
  name: 'Name',
  mobile: 'Mobile',
  email: 'Email',
  notes: 'Notes',
  company: 'Company',
  occasion: 'Occasion',
  budget: 'Budget',
  fulfillment: 'Pickup / delivery',
  address: 'Delivery address',
  message: 'Message',
};

export function composeEmail(type: InquiryType, f: Fields) {
  const subject =
    type === 'reservation'
      ? `Cake reservation: ${f.cake} ×${f.quantity}, ${f.date} at ${f.branch} (${f.name})`
      : `Celebrations inquiry: ${f.occasion}, ${f.date} (${f.name}${f.company ? `, ${f.company}` : ''})`;
  const rows = Object.entries(f).filter(([, v]) => v);
  const text = [
    type === 'reservation' ? 'New cake reservation from the website' : 'New celebrations / corporate inquiry',
    '',
    ...rows.map(([k, v]) => `${LABELS[k] ?? k}: ${v}`),
    '',
    type === 'reservation' ? 'Text the customer to confirm the reservation and payment.' : 'Reply with options and a quote.',
  ].join('\n');
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const html = `<div style="font-family:Georgia,serif;color:#1a1a1a;max-width:560px">
<h2 style="font-family:Helvetica,Arial,sans-serif;font-weight:400;letter-spacing:.12em;text-transform:uppercase;font-size:16px">${esc(
    type === 'reservation' ? 'New cake reservation' : 'New celebrations inquiry',
  )}</h2>
<table style="border-collapse:collapse;width:100%">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #e6dac8;color:#5c554d;vertical-align:top;white-space:nowrap">${esc(
          LABELS[k] ?? k,
        )}</td><td style="padding:8px 0;border-bottom:1px solid #e6dac8;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('')}</table></div>`;
  return { subject, text, html };
}

export const SUCCESS: Record<InquiryType, string> = {
  reservation: "Thanks! We'll text you to confirm your reservation and payment.",
  corporate: "Thanks! We'll get back to you soon with options and a quote.",
};
