'use server';

import { clean, guardForm } from '@/lib/server/form-guard';
import { institutionInbox, isEmail, nowIST, renderEmail, sendMail, submissionRef } from '@/lib/server/mail';

/**
 * Contact form → the college inbox, with Reply-To set to the sender so the
 * office answers with one click. Each message carries a short reference
 * (MSG-YYMMDD-XXXX) in the subject, which the visitor also sees on screen and
 * can quote if they follow up.
 */
export async function sendContactMessage(data) {
  const guard = await guardForm('contact', data);
  if (guard.silent) return { ok: true, ref: submissionRef('MSG') };
  if (!guard.ok) return { error: guard.error };

  const name = clean(data?.name, 120);
  const email = clean(data?.email, 200);
  const mobile = clean(data?.mobile, 15).replace(/\D/g, '').replace(/^(?:91|0)(?=\d{10}$)/, '');
  const subject = clean(data?.subject, 200);
  const message = clean(data?.message, 5000);

  if (!name || !subject || !message) return { error: 'Please fill in every required field.' };
  if (!isEmail(email)) return { error: 'Please enter a valid email address.' };
  if (mobile && !/^[6-9]\d{9}$/.test(mobile)) return { error: 'Please enter a valid 10-digit mobile number, or leave it blank.' };

  const ref = submissionRef('MSG');
  const { html, text } = renderEmail({
    preheader: `${name}: ${subject}`,
    heading: 'New message from the website',
    intro: `Sent through the Contact Us form on ${nowIST()}. Reply to this email to answer ${name} directly.`,
    badge: { label: 'Message reference', value: ref },
    rows: [
      ['Name', name],
      ['Email', email],
      ['Mobile', mobile],
      ['Subject', subject],
      ['Message', message],
    ],
  });

  const sent = await sendMail({
    to: await institutionInbox(),
    subject: `Website contact ${ref}: ${subject}`,
    html,
    text,
    replyTo: email,
  });

  return sent
    ? { ok: true, ref }
    : { error: 'Your message could not be sent right now. Please try again, or call the institute office.' };
}
