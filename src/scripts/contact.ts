/**
 * Contact form: validation as you go, a character counter, ⌘/Ctrl + Enter to send, a fill-time
 * stamp for the spam check, and the sending → success / error states. The server side (and every
 * spam check that matters) lives in worker/index.ts.
 */
const form = document.querySelector<HTMLFormElement>('[data-c-form]');

if (form) {
  const started = performance.now();
  const status = document.querySelector<HTMLElement>('[data-c-status]')!;
  const send = form.querySelector<HTMLButtonElement>('[data-c-send]')!;
  const done = document.querySelector<HTMLElement>('[data-c-done]')!;
  const message = form.querySelector<HTMLTextAreaElement>('#c-message')!;
  const count = form.querySelector<HTMLElement>('[data-c-count]')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const field = (name: string) => form.querySelector<HTMLElement>(`[data-field="${name}"]`);
  const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? '';
  const checks: Record<string, () => boolean> = {
    name: () => value('name').length >= 2,
    email: () => /^[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}$/i.test(value('email')),
    message: () => value('message').length >= 10,
    consent: () => (form.elements.namedItem('consent') as HTMLInputElement).checked,
  };
  const show = (name: string, ok: boolean) => field(name)?.classList.toggle('is-invalid', !ok);
  const validate = () => Object.entries(checks).map(([name, ok]) => { show(name, ok()); return ok(); }).every(Boolean);

  // Validate a field once it has been left; after that, re-check as the person types
  Object.keys(checks).forEach((name) => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    let touched = false;
    input.addEventListener('blur', () => { if (name !== 'consent' && input.value) { touched = true; show(name, checks[name]()); } });
    input.addEventListener(name === 'consent' ? 'change' : 'input', () => { if (touched || name === 'consent' || field(name)?.classList.contains('is-invalid')) show(name, checks[name]()); });
  });

  // Counter and a textarea that grows with the text
  const grow = () => {
    count.textContent = String(message.value.length);
    count.parentElement!.classList.toggle('is-near', message.value.length > 3600);
    message.style.height = 'auto';
    message.style.height = `${Math.min(message.scrollHeight + 2, 480)}px`;
  };
  message.addEventListener('input', grow);

  form.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); form.requestSubmit(); } });

  const setStatus = (text: string, error = false, withEmail = false) => {
    status.classList.toggle('is-error', error);
    status.textContent = text;
    if (withEmail) {
      const email = status.dataset.email!;
      status.append(' ');
      const a = document.createElement('a');
      a.href = `mailto:${email}`;
      a.textContent = email;
      status.append(a, '.');
    }
  };

  // Turnstile fills a hidden input once the (usually invisible) check has passed
  const turnstileToken = async () => {
    for (let i = 0; i < 40; i++) {
      const token = (form.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value;
      if (token) return token;
      await new Promise((r) => setTimeout(r, 150));
    }
    return '';
  };

  const showDone = () => {
    const finish = () => {
      form.hidden = true;
      form.classList.remove('is-leaving');
      done.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => done.classList.add('is-in')));
      done.focus();
    };
    if (reduced) finish();
    else { form.classList.add('is-leaving'); setTimeout(finish, 260); }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (send.getAttribute('aria-busy') === 'true') return;
    if (!validate()) {
      form.querySelector<HTMLElement>('.is-invalid :is(input, textarea)')?.focus();
      return;
    }
    send.setAttribute('aria-busy', 'true');
    setStatus(status.dataset.sending!);
    const token = await turnstileToken();
    const payload = {
      name: value('name'),
      email: value('email'),
      company: value('company'),
      message: value('message'),
      services: Array.from(form.querySelectorAll<HTMLInputElement>('[name="services"]:checked')).map((i) => i.value),
      budget: form.querySelector<HTMLInputElement>('[name="budget"]:checked')?.value ?? '',
      consent: checks.consent(),
      website: value('website'),
      elapsed: Math.round(performance.now() - started),
      language: form.dataset.lang,
      token,
    };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; fields?: string[] };
      if (res.ok && data.ok) {
        setStatus('');
        showDone();
        return;
      }
      if (data.fields?.length) data.fields.forEach((name) => show(name, false));
      setStatus(res.status === 429 ? status.dataset.rate! : status.dataset.fail!, true, true);
      (window as unknown as { turnstile?: { reset(): void } }).turnstile?.reset();
    } catch {
      setStatus(status.dataset.fail!, true, true);
    } finally {
      send.removeAttribute('aria-busy');
    }
  });

  // "Send another message"
  document.querySelector('[data-c-again]')?.addEventListener('click', () => {
    form.reset();
    grow();
    done.classList.remove('is-in');
    done.hidden = true;
    form.hidden = false;
    (window as unknown as { turnstile?: { reset(): void } }).turnstile?.reset();
    form.querySelector<HTMLInputElement>('#c-name')?.focus();
  });
}
