import 'server-only';

import { TYPE_META, categoryLabel, complainantName, identityRows } from '@/lib/igrs';
import { getSection } from './sections';
import { institutionInbox, isEmail, nowIST, renderEmail, sendMail, siteUrl } from './mail';

/**
 * IGRS emails. Grievance notifications are best-effort: the grievance is saved
 * before any of these run, so a mail failure is logged and never surfaced as a
 * failed submission. The password-reset code is the exception — its caller
 * needs to know whether it went.
 */

const typeLabel = (g) => TYPE_META[g.type]?.label || g.type;
const trackUrl = (g) => `${siteUrl()}/igrs/status?ref=${encodeURIComponent(g.refNumber)}`;

/** New grievance: full details to the committee, a receipt to the complainant. */
export async function notifyNewGrievance(g) {
  const options = (await getSection('igrs-options').catch(() => null)) || {};
  const category = categoryLabel(g.type, g.category);

  const committee = renderEmail({
    preheader: `${typeLabel(g)} grievance from ${complainantName(g)}: ${g.subject}`,
    heading: `New ${typeLabel(g).toLowerCase()} grievance`,
    intro: `Received through the IGRS portal on ${nowIST()}. Review it and record the committee's action from the dashboard.`,
    badge: { label: 'Reference number', value: g.refNumber },
    rows: [
      ['Grievance type', typeLabel(g)],
      ...identityRows(g, options),
      ['Category', category],
      ['Subject', g.subject],
      ['Description', g.description],
    ],
    cta: { label: 'Open committee dashboard', href: `${siteUrl()}/igrs/admin` },
    footer: 'Reply to this email to write to the complainant directly.',
  });

  const jobs = [
    sendMail({
      to: await institutionInbox(),
      subject: `IGRS ${g.refNumber} · ${typeLabel(g)} · ${g.subject}`,
      ...committee,
      replyTo: isEmail(g.email) ? g.email : undefined,
    }),
  ];

  if (isEmail(g.email)) {
    const receipt = renderEmail({
      preheader: `Your reference number is ${g.refNumber}`,
      heading: 'Your grievance has been registered',
      intro:
        'Thank you for raising your concern. It has been recorded and forwarded to the institute grievance committee. Keep the reference number below — you will need it to check the status.',
      badge: { label: 'Your reference number', value: g.refNumber },
      rows: [
        ['Category', category],
        ['Subject', g.subject],
        ['Status', g.status],
        ['Registered on', nowIST()],
      ],
      cta: { label: 'Track your grievance', href: trackUrl(g) },
      footer: 'This is an automated message from the KMGGP Badalpur IGRS portal; please do not reply to it.',
    });
    jobs.push(sendMail({ to: g.email, subject: `Grievance registered — ${g.refNumber}`, ...receipt }));
  }

  await Promise.all(jobs);
}

/** Status or remarks changed: let the complainant know. */
export async function notifyGrievanceUpdate(g) {
  if (!isEmail(g.email)) return;

  const update = renderEmail({
    preheader: `Status: ${g.status}`,
    heading: `Your grievance is now “${g.status}”`,
    intro: 'The institute grievance committee has updated your case.',
    badge: { label: 'Reference number', value: g.refNumber },
    rows: [
      ['Subject', g.subject],
      ['Status', g.status],
      ['Committee remarks', g.remarks],
      ['Updated on', nowIST()],
    ],
    cta: { label: 'View full status', href: trackUrl(g) },
    footer: 'This is an automated message from the KMGGP Badalpur IGRS portal; please do not reply to it.',
  });

  await sendMail({ to: g.email, subject: `Grievance ${g.refNumber}: ${g.status}`, ...update });
}

/** The one-time password-reset code. Returns whether it was accepted. */
export async function sendResetCode(to, code) {
  const mail = renderEmail({
    preheader: `Your IGRS password reset code is ${code}`,
    heading: 'IGRS admin password reset',
    intro:
      'A password reset was requested for the IGRS committee login. Enter this code on the reset screen. It is valid for 10 minutes and can be used once.',
    badge: { label: 'One-time code', value: code },
    rows: [['Requested on', nowIST()]],
    footer:
      'If you did not ask for this, ignore this email — the password stays as it is. Never share this code with anyone; institute staff will never ask for it.',
  });
  return sendMail({ to, subject: `IGRS password reset code: ${code}`, ...mail });
}
