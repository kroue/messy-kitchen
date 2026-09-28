import type { APIRoute } from 'astro';
import { INQUIRY_TO_EMAIL, RESEND_API_KEY, RESEND_FROM } from 'astro:env/server';
import { Resend } from 'resend';
import { SITE } from '../../config/site';
import { composeEmail, SUCCESS, validateCorporate, validateReservation, type InquiryType } from '../../lib/inquiry';
import { manilaToday } from '../../lib/time';

// The only on-demand route. Everything else is prerendered static HTML.
export const prerender = false;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json(400, { ok: false, message: 'Invalid form submission.' });
  }

  const type: InquiryType = fd.get('type') === 'corporate' ? 'corporate' : 'reservation';
  const done = (demo = false) =>
    wantsJson ? json(200, { ok: true, message: SUCCESS[type], demo }) : redirect(`/thank-you/?type=${type}`, 303);

  // Spam checks: a filled honeypot or an instant submit gets a quiet "success".
  const startedAt = Number(fd.get('started') ?? 0);
  if (String(fd.get('website') ?? '') !== '' || (startedAt && Date.now() - startedAt < 2500)) return done();

  const today = manilaToday();
  const result = type === 'reservation' ? validateReservation(fd, today) : validateCorporate(fd, today);

  if (!result.ok) {
    if (wantsJson) return json(422, { ok: false, errors: result.errors });
    const list = Object.values(result.errors)
      .map((e) => `<li>${e}</li>`)
      .join('');
    return new Response(
      `<!doctype html><html lang="en-PH"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Please check the form | ${SITE.name}</title><body style="font-family:Georgia,serif;max-width:36rem;margin:3rem auto;padding:0 1rem;color:#1a1a1a;background:#fbf8f3"><h1 style="font-family:sans-serif;font-weight:300;letter-spacing:.12em;text-transform:uppercase">Almost there</h1><p>Please go back and check:</p><ul>${list}</ul><p><a href="javascript:history.back()">Go back to the form</a></p></body></html>`,
      { status: 422, headers: { 'content-type': 'text/html; charset=utf-8' } },
    );
  }

  // Demo mode: no Resend credentials → pretend it worked so the preview feels real.
  if (!RESEND_API_KEY || !INQUIRY_TO_EMAIL) {
    console.info(`[inquiry] demo mode, not sending ${type}`, result.fields);
    return done(true);
  }

  const { subject, text, html } = composeEmail(type, result.fields);
  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: RESEND_FROM || `${SITE.name} Website <onboarding@resend.dev>`,
    to: INQUIRY_TO_EMAIL.split(',').map((s) => s.trim()),
    replyTo: result.fields.email || undefined,
    subject,
    text,
    html,
  });

  if (error) {
    console.error('[inquiry] resend error', error);
    const message = `Sorry, that didn't go through. Please message us on Messenger instead.`;
    return wantsJson ? json(502, { ok: false, message }) : new Response(message, { status: 502 });
  }

  return done();
};
