import 'server-only';

import { getSection } from './sections';

/**
 * Outgoing email through Resend (https://resend.com), over plain fetch.
 *
 * Mail is sent from the verified kmggpbadalpur.ac.in domain. Without
 * RESEND_API_KEY every send is skipped with a log line, so local development
 * and form submissions keep working without it.
 */

const API_KEY = process.env.RESEND_API_KEY || '';
const FROM = process.env.MAIL_FROM || 'KMGGP Badalpur <contact@kmggpbadalpur.ac.in>';

export function mailEnabled() {
  return Boolean(API_KEY);
}

/** Where form submissions are delivered: MAIL_TO, else the site's public email. */
export async function institutionInbox() {
  if (process.env.MAIL_TO) return process.env.MAIL_TO;
  const topbar = await getSection('topbar').catch(() => null);
  return topbar?.email || 'ggpbad@gmail.com';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * The branded email body: a navy header with the institute's name, a heading,
 * an optional highlighted badge (a reference number or a code), a label/value
 * table, an optional button and a footer. Every value is escaped — these carry
 * visitor-typed text. Tables and inline styles only, because that is what
 * email clients render reliably.
 *
 * badge: { label, value }   cta: { label, href }
 */
export function renderEmail({ heading, intro = '', rows = [], footer = '', badge = null, cta = null, preheader = '' }) {
  const shown = rows.filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');
  const tableRows = shown
    .map(
      ([label, value], i) =>
        `<tr style="background:${i % 2 ? '#ffffff' : '#fbfaf7'}"><td style="padding:10px 14px;border-bottom:1px solid #eef0f3;color:#6b7a8a;font-size:13px;white-space:nowrap;vertical-align:top;width:38%">${escapeHtml(label)}</td>` +
        `<td style="padding:10px 14px;border-bottom:1px solid #eef0f3;color:#12202f;font-size:14px;white-space:pre-wrap;vertical-align:top">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const badgeHtml = badge
    ? `<div style="margin:4px 0 22px;padding:16px 18px;border:1px dashed #c9a227;border-radius:10px;background:#fdf8ea;text-align:center">
<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6d14">${escapeHtml(badge.label)}</div>
<div style="margin-top:6px;font-family:'Courier New',monospace;font-size:24px;font-weight:bold;letter-spacing:3px;color:#0a2540">${escapeHtml(badge.value)}</div></div>`
    : '';

  const ctaHtml =
    cta && /^https?:\/\//.test(cta.href)
      ? `<div style="margin:24px 0 4px;text-align:center"><a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:12px 26px;border-radius:999px;background:#c9a227;color:#071c33;font-weight:bold;font-size:14px;text-decoration:none">${escapeHtml(cta.label)}</a></div>`
      : '';

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>` : ''}
<div style="max-width:620px;margin:0 auto;padding:24px 12px">
<div style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e3e9f0;box-shadow:0 8px 24px rgba(10,37,64,.08)">
<div style="background:#0a2540;background-image:linear-gradient(135deg,#071c33,#0e3358 55%,#134a7c);padding:22px 26px">
<div style="color:#ecd282;font-size:16px;font-weight:bold;letter-spacing:.3px">Km. Mayawati Government Girls Polytechnic</div>
<div style="color:#c9d6e6;font-size:12px;margin-top:3px">Badalpur, Gautam Buddha Nagar, Uttar Pradesh</div></div>
<div style="height:3px;background:linear-gradient(90deg,#a8841c,#ecd282,#c9a227)"></div>
<div style="padding:26px">
<h2 style="margin:0 0 12px;color:#0a2540;font-size:20px;line-height:1.3">${escapeHtml(heading)}</h2>
${intro ? `<p style="margin:0 0 18px;color:#46586b;font-size:14px;line-height:1.6">${escapeHtml(intro)}</p>` : ''}
${badgeHtml}
${tableRows ? `<table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #eef0f3;border-radius:8px">${tableRows}</table>` : ''}
${ctaHtml}
${footer ? `<p style="margin:22px 0 0;color:#7a8b9c;font-size:12px;line-height:1.6;white-space:pre-wrap">${escapeHtml(footer)}</p>` : ''}
</div></div>
<p style="text-align:center;color:#7a8b9c;font-size:11px;margin:14px 0 0">Sent by the KMGGP Badalpur website</p>
</div></body></html>`;

  const text = [
    heading,
    intro,
    badge && `${badge.label}: ${badge.value}`,
    ...shown.map(([l, v]) => `${l}: ${v}`),
    cta && `${cta.label}: ${cta.href}`,
    footer,
  ]
    .filter(Boolean)
    .join('\n\n');

  return { html, text };
}

/** Public address of the site, for links in emails. */
export function siteUrl() {
  return (process.env.SITE_URL || 'https://www.kmggpbadalpur.ac.in').replace(/\/+$/, '');
}

/**
 * A short reference for a form submission, e.g. ENQ-261122-K7Q4 — quoted in
 * the subject so the office can find and reply to a message easily.
 */
export function submissionRef(prefix) {
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const date = ist.toISOString().slice(2, 10).replace(/-/g, '');
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let tail = '';
  for (let i = 0; i < 4; i += 1) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${prefix}-${date}-${tail}`;
}

/** Indian date and time, for "received at" lines. */
export function nowIST() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Send one email. Returns true when Resend accepted it. Never throws — a mail
 * failure must not lose the visitor's submission, so callers decide what to do.
 */
export async function sendMail({ to, subject, html, text, replyTo }) {
  if (!mailEnabled()) {
    console.warn(`[mail] RESEND_API_KEY not set — skipped "${subject}"`);
    return false;
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject: String(subject).replace(/[\r\n]+/g, ' ').slice(0, 200),
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`[mail] Resend rejected "${subject}" (${response.status}):`, (await response.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[mail] Could not send "${subject}":`, error);
    return false;
  }
}

/** A loose email check for addresses typed into public forms. */
export function isEmail(value) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(value || '').trim());
}
