/**
 * Progressive enhancement for the reservation and corporate forms.
 * Without JavaScript the forms still POST to /api/inquiry and land on /thank-you/.
 */

const manilaToday = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(),
  );

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function fieldError(form: HTMLFormElement, name: string) {
  return form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
}

function setError(form: HTMLFormElement, name: string, message: string | null) {
  const el = fieldError(form, name);
  form.querySelectorAll<Control>(`[name="${name}"]`).forEach((c) => {
    if (message) c.setAttribute('aria-invalid', 'true');
    else c.removeAttribute('aria-invalid');
  });
  if (el) {
    el.textContent = message ?? '';
    el.hidden = !message;
  }
}

function clientErrors(form: HTMLFormElement): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const el of Array.from(form.elements) as Control[]) {
    if (!el.name || el.disabled || el.closest('[hidden]') || !('validity' in el)) continue;
    if (!el.validity.valid && !errors[el.name]) {
      errors[el.name] = el.dataset.msg || el.validationMessage;
    }
  }
  return errors;
}

function showErrors(form: HTMLFormElement, errors: Record<string, string>) {
  const names = new Set(
    (Array.from(form.elements) as Control[]).map((e) => e.name).filter(Boolean),
  );
  names.forEach((n) => setError(form, n, errors[n] ?? null));
  const first = Object.keys(errors)[0];
  if (first) form.querySelector<Control>(`[name="${first}"]`)?.focus();
}

function init(form: HTMLFormElement) {
  const wrap = form.closest<HTMLElement>('[data-form-wrap]')!;
  const status = wrap.querySelector<HTMLElement>('[data-status]')!;
  const success = wrap.querySelector<HTMLElement>('[data-success]')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const params = new URLSearchParams(location.search);

  // Timestamp for the simple bot check on the server.
  const started = form.querySelector<HTMLInputElement>('[name="started"]');
  if (started) started.value = String(Date.now());

  // Date limits in Philippine time.
  form.querySelectorAll<HTMLInputElement>('input[type="date"][data-min-lead]').forEach((input) => {
    const today = manilaToday();
    input.min = addDays(today, Number(input.dataset.minLead));
    input.max = addDays(today, Number(input.dataset.maxLead ?? 365));
  });

  // Pre-select from the URL: /reserve/?cake=ube-cake&branch=kauswagan
  (['cake', 'branch'] as const).forEach((key) => {
    const value = params.get(key);
    const select = form.querySelector<HTMLSelectElement>(`select[name="${key}"]`);
    if (value && select && [...select.options].some((o) => o.value === value)) select.value = value;
  });

  // Live character counter.
  form.querySelectorAll<HTMLInputElement>('[data-counter]').forEach((input) => {
    const out = form.querySelector<HTMLElement>(`[data-count-for="${input.name}"]`);
    const update = () => out && (out.textContent = `${input.value.length}/${input.maxLength}`);
    input.addEventListener('input', update);
    update();
  });

  // Pickup vs delivery (corporate form).
  const toggles = form.querySelectorAll<HTMLInputElement>('input[name="fulfillment"]');
  const syncFulfillment = () => {
    const value = [...toggles].find((t) => t.checked)?.value;
    form.querySelectorAll<HTMLElement>('[data-show-when]').forEach((el) => {
      const on = el.dataset.showWhen === value;
      el.hidden = !on;
      el.querySelectorAll<Control>('input, select, textarea').forEach((c) => (c.required = on));
    });
  };
  toggles.forEach((t) => t.addEventListener('change', syncFulfillment));
  syncFulfillment();

  // Clear a field's error as soon as it's edited.
  form.addEventListener('input', (e) => {
    const t = e.target as Control;
    if (t.name && t.getAttribute('aria-invalid') === 'true' && t.validity.valid) setError(form, t.name, null);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.hidden = true;
    const errors = clientErrors(form);
    showErrors(form, errors);
    if (Object.keys(errors).length) return;

    const label = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        form.hidden = true;
        success.querySelector('[data-success-message]')!.textContent = data.message;
        success.querySelector<HTMLElement>('[data-demo-note]')!.hidden = !data.demo;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
      if (data.errors) {
        showErrors(form, data.errors);
      } else {
        status.textContent = data.message ?? 'Something went wrong. Please try again, or message us on Messenger.';
        status.hidden = false;
      }
    } catch {
      status.textContent = 'You seem to be offline. Please try again, or message us on Messenger.';
      status.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-inquiry]').forEach(init);
