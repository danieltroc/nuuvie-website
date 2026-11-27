/**
 * The site's only server code. Static files are served by Cloudflare directly; this Worker runs
 * only for /api/* (the contact form) and the Typo Toolkit page (wrangler.jsonc: assets.run_worker_first).
 *
 * Spam protection, cheapest checks first:
 *  1. same-origin requests only, small bodies only
 *  2. rate limit: 3 submissions per minute per IP (CONTACT_LIMIT binding)
 *  3. honeypot field and minimum fill time — bots get a fake "ok" and nothing is sent
 *  4. strict validation, link / HTML filters (also a silent "ok")
 *  5. Cloudflare Turnstile token verified with TURNSTILE_SECRET
 * Mail goes out through Resend (RESEND_API_KEY). Local testing: CONTACT_DRY_RUN=1 in .dev.vars.
 */

import { PATH as TT_PATH, isLive } from '../src/lib/typo-toolkit';

interface RateLimiter { limit(options: { key: string }): Promise<{ success: boolean }> }
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  CONTACT_LIMIT?: RateLimiter;
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  CONTACT_DRY_RUN?: string;
}

const MIN_FILL_MS = 3000;
const MAX_BODY = 20_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isEmail = (v: string) => /^[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}$/i.test(v) && v.length <= 200;
const linkCount = (v: string) => (v.match(/https?:\/\/|www\./gi) ?? []).length;

async function verifyTurnstile(token: string, ip: string, secret: string) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

async function contact(request: Request, env: Env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

  // 1. Same origin, small body
  const origin = request.headers.get('origin');
  const host = new URL(request.url).host;
  if (!origin || new URL(origin).host !== host) return json({ ok: false, error: 'origin' }, 403);
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return json({ ok: false, error: 'size' }, 413);

  // 2. Rate limit per IP
  const ip = request.headers.get('cf-connecting-ip') ?? '';
  if (env.CONTACT_LIMIT) {
    const { success } = await env.CONTACT_LIMIT.limit({ key: ip || 'unknown' });
    if (!success) return json({ ok: false, error: 'rate' }, 429);
  }

  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // 3. Honeypot and fill time: pretend it worked, send nothing
  if (text(data.website, 200) || Number(data.elapsed ?? 0) < MIN_FILL_MS) return json({ ok: true });

  // 4. Validation
  const name = text(data.name, 100);
  const email = text(data.email, 200);
  const company = text(data.company, 120);
  const message = text(data.message, 4000);
  const services = Array.isArray(data.services) ? data.services.map((s) => text(s, 60)).filter(Boolean).slice(0, 8) : [];
  const budget = text(data.budget, 60);
  const language = data.language === 'en' ? 'en' : 'pl';
  const fields: Record<string, boolean> = {
    name: name.length >= 2,
    email: isEmail(email),
    message: message.length >= 10,
    consent: data.consent === true,
  };
  const invalid = Object.keys(fields).filter((k) => !fields[k]);
  if (invalid.length) return json({ ok: false, error: 'fields', fields: invalid }, 422);
  if (linkCount(message) > 2 || /<[a-z!\/]|\[url=/i.test(message + name + company)) return json({ ok: true });

  // 5. Turnstile
  if (!env.TURNSTILE_SECRET) return json({ ok: false, error: 'config' }, 503);
  const token = text(data.token, 2048);
  if (!token || !(await verifyTurnstile(token, ip, env.TURNSTILE_SECRET))) return json({ ok: false, error: 'captcha' }, 403);

  // Send
  const subject = `Nowe zapytanie: ${name}${company ? ` (${company})` : ''}`;
  const lines = [`Imię i nazwisko: ${name}`, `E-mail: ${email}`];
  if (company) lines.push(`Firma: ${company}`);
  if (services.length) lines.push(`Czego potrzebuje: ${services.join(', ')}`);
  if (budget) lines.push(`Budżet: ${budget}`);
  // Record of the optional marketing consent (privacy policy § 9): what was ticked and when
  const marketing = data.marketing === true;
  lines.push(`Zgoda marketingowa: ${marketing ? `TAK (${new Date().toISOString()})` : 'nie'}`);
  lines.push(`Język strony: ${language.toUpperCase()}`, '', message);
  const body = lines.join('\n');

  if (env.CONTACT_DRY_RUN === '1') {
    console.log(`[contact] dry run\n${subject}\n${body}`);
    return json({ ok: true, dryRun: true });
  }
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'config' }, 503);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM ?? 'Formularz Nuuvie <strona@formularz.nuuvie.com>',
      to: [env.CONTACT_TO ?? 'hej@nuuvie.com'],
      reply_to: email,
      subject,
      text: body,
    }),
  });
  if (!res.ok) {
    console.error('[contact] resend failed', res.status, await res.text());
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true });
}

/**
 * Typo Toolkit 2027 (src/lib/typo-toolkit.ts). Before LAUNCH: a preview on *.workers.dev only
 * (noindex), 404 on nuuvie.com. From LAUNCH on it is an ordinary page, no change needed.
 */
async function typoToolkit(request: Request, env: Env, url: URL) {
  const live = isLive(Date.now());
  if (!live && url.hostname.endsWith('nuuvie.com')) {
    const page = await env.ASSETS.fetch(new Request(new URL('/404', url)));
    return new Response(page.body, { status: 404, headers: page.headers });
  }
  const res = await env.ASSETS.fetch(request);
  if (live) return res;
  const out = new Response(res.body, res);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return contact(request, env);
    // The old preview address
    if (url.pathname === '/fonty' || url.pathname === '/fonty/') return Response.redirect(new URL(TT_PATH, url).href, 301);
    // The page and its files (the free sample PDF)
    if (url.pathname === TT_PATH || url.pathname.startsWith(`${TT_PATH}/`)) return typoToolkit(request, env, url);
    return env.ASSETS.fetch(request);
  },
};
