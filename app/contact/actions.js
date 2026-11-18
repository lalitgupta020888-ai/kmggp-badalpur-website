'use server';

import { clean, guardForm } from '@/lib/server/form-guard';
import { institutionInbox, isEmail, renderEmail, sendMail } from '@/lib/server/mail';

/** Contact form → email to the institute inbox, replying straight to the sender. */
export async function sendContactMessage(data) {
  const guard = await guardForm('contact', data);
  if (guard.silent) return { ok: true };
  if (!guard.ok) return { error: guard.error };

  const name = clean(data?.name, 120);
  const email = clean(data?.email, 200);
  const subject = clean(data?.subject, 200);
  const message = clean(data?.message, 5000);

  if (!name || !subject || !message) return { error: 'Please fill in every field.' };
  if (!isEmail(email)) return { error: 'Please enter a valid email address.' };

  const { html, text } = renderEmail({
    heading: 'New message from the website',
    intro: 'Sent through the Contact Us form. Reply to this email to answer the sender directly.',
    rows: [
      ['Name', name],
      ['Email', email],
      ['Subject', subject],
      ['Message', message],
    ],
  });

  const sent = await sendMail({
    to: await institutionInbox(),
    subject: `Website contact: ${subject}`,
    html,
    text,
    replyTo: email,
  });

  return sent ? { ok: true } : { error: 'Your message could not be sent right now. Please try again or call us.' };
}
