import 'server-only';

import { institutionInbox, isEmail, renderEmail, sendMail } from './mail';

/**
 * IGRS notification emails. All are best-effort: a grievance is already saved
 * before any of these run, so a mail failure is logged and never surfaced as
 * a failed submission.
 */

const TYPE_LABEL = { student: 'Student', parent: 'Parent', employee: 'Employee' };

function siteUrl() {
  return (process.env.SITE_URL || 'https://www.kmggpbadalpur.ac.in').replace(/\/+$/, '');
}

function complainantName(g) {
  return g.type === 'parent' ? g.parentName : g.name;
}

/** Identity rows for the committee's copy, by user type. */
function identityRows(g) {
  if (g.type === 'student') {
    return [['Name', g.name], ['Roll number', g.rollNumber], ['Course', g.course], ['Year', g.year]];
  }
  if (g.type === 'parent') {
    return [
      ['Parent / guardian', g.parentName],
      ['Relation', g.relation],
      ['Student', g.name],
      ['Student roll number', g.rollNumber],
    ];
  }
  return [
    ['Name', g.name],
    ['Employee ID', g.employeeId],
    ['Department', g.department],
    ['Designation', g.designation],
  ];
}

/** New grievance: full details to the committee, a receipt to the complainant. */
export async function notifyNewGrievance(g) {
  const type = TYPE_LABEL[g.type] || g.type;

  const committee = renderEmail({
    heading: `New ${type.toLowerCase()} grievance — ${g.refNumber}`,
    intro: 'A new grievance has been submitted through the IGRS portal. Review and update it from the committee dashboard.',
    rows: [
      ['Reference', g.refNumber],
      ['Type', type],
      ...identityRows(g),
      ['Email', g.email],
      ['Phone', g.phone],
      ['Category', g.category],
      ['Subject', g.subject],
      ['Description', g.description],
    ],
    footer: `Committee dashboard: ${siteUrl()}/igrs/admin`,
  });

  const jobs = [
    sendMail({
      to: await institutionInbox(),
      subject: `IGRS ${g.refNumber}: ${g.subject}`,
      ...committee,
      replyTo: isEmail(g.email) ? g.email : undefined,
    }),
  ];

  if (isEmail(g.email)) {
    const receipt = renderEmail({
      heading: 'Your grievance has been received',
      intro: `Dear ${complainantName(g)}, your grievance has been recorded. Keep the reference number below — you need it to track your case.`,
      rows: [
        ['Reference number', g.refNumber],
        ['Subject', g.subject],
        ['Status', g.status],
      ],
      footer: `Track your grievance: ${siteUrl()}/igrs/status?ref=${g.refNumber}\nThis is an automated message; please do not reply.`,
    });
    jobs.push(sendMail({ to: g.email, subject: `Grievance received — ${g.refNumber}`, ...receipt }));
  }

  await Promise.all(jobs);
}

/** Status or remarks changed: let the complainant know. */
export async function notifyGrievanceUpdate(g) {
  if (!isEmail(g.email)) return;

  const update = renderEmail({
    heading: `Update on your grievance — ${g.status}`,
    intro: `Dear ${complainantName(g)}, the grievance committee has updated your case.`,
    rows: [
      ['Reference number', g.refNumber],
      ['Subject', g.subject],
      ['Status', g.status],
      ['Committee remarks', g.remarks],
    ],
    footer: `Track your grievance: ${siteUrl()}/igrs/status?ref=${g.refNumber}\nThis is an automated message; please do not reply.`,
  });

  await sendMail({ to: g.email, subject: `Grievance ${g.refNumber}: ${g.status}`, ...update });
}
