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
 * A plain, readable email body: a heading, optional intro, and a label/value
 * table. Every value is escaped — these carry visitor-typed text.
 */
export function renderEmail({ heading, intro = '', rows = [], footer = '' }) {
  const tableRows = rows
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f2;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e0">
<div style="background:#0b1f3a;color:#f3c969;padding:18px 24px;font-size:15px;font-weight:bold">Km. Mayawati Government Girls Polytechnic<div style="color:#fff;font-weight:normal;font-size:13px;margin-top:2px">Badalpur, Gautam Buddha Nagar</div></div>
<div style="padding:24px">
<h2 style="margin:0 0 12px;color:#0b1f3a;font-size:20px">${escapeHtml(heading)}</h2>
${intro ? `<p style="margin:0 0 16px;color:#333;line-height:1.5">${escapeHtml(intro)}</p>` : ''}
${tableRows ? `<table style="width:100%;border-collapse:collapse;font-size:14px">${tableRows}</table>` : ''}
${footer ? `<p style="margin:20px 0 0;color:#666;font-size:13px;line-height:1.5">${escapeHtml(footer)}</p>` : ''}
</div></div></body></html>`;

  const text = [heading, intro, ...rows.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`), footer]
    .filter(Boolean)
    .join('\n\n');

  return { html, text };
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
