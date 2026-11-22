'use server';

import { clean, guardForm } from '@/lib/server/form-guard';
import { institutionInbox, isEmail, nowIST, renderEmail, sendMail, siteUrl, submissionRef } from '@/lib/server/mail';

const COURSES = {
  ee: 'Electronics Engineering',
  cse: 'Computer Science & Engineering',
  it: 'Information Technology',
  undecided: 'Not decided yet',
};
const CLASS10 = { passed: 'Passed', appearing: 'Result awaited' };

/**
 * Admission enquiry → email to the institute inbox, plus a short
 * acknowledgement to the applicant.
 */
export async function sendAdmissionEnquiry(data) {
  const guard = await guardForm('enquiry', data);
  if (guard.silent) return { ok: true, ref: submissionRef('ENQ') };
  if (!guard.ok) return { error: guard.error };

  const name = clean(data?.name, 120);
  const mobile = clean(data?.mobile, 15).replace(/\D/g, '').replace(/^(?:91|0)(?=\d{10}$)/, '');
  const email = clean(data?.email, 200);
  const course = COURSES[clean(data?.course)] || '';
  const class10 = CLASS10[clean(data?.class10)] || '';
  const city = clean(data?.city, 120);
  const query = clean(data?.query, 3000);

  if (!name || !course || !class10) return { error: 'Please fill in every required field.' };
  if (!/^[6-9][0-9]{9}$/.test(mobile)) return { error: 'Please enter a valid 10-digit mobile number.' };
  if (!isEmail(email)) return { error: 'Please enter a valid email address.' };

  const rows = [
    ['Name', name],
    ['Mobile', mobile],
    ['Email', email],
    ['Interested course', course],
    ['Class 10th', class10],
    ['City / District', city],
    ['Query', query],
  ];

  const ref = submissionRef('ENQ');

  const toOffice = renderEmail({
    preheader: `${name} · ${course} · ${mobile}`,
    heading: 'New admission enquiry',
    intro: `Submitted through the Admission Enquiry form on ${nowIST()}. Reply to this email to answer the applicant, or call them on the number below.`,
    badge: { label: 'Enquiry reference', value: ref },
    rows,
  });

  const sent = await sendMail({
    to: await institutionInbox(),
    subject: `Admission enquiry ${ref}: ${name} (${course})`,
    ...toOffice,
    replyTo: email,
  });
  if (!sent) return { error: 'Your enquiry could not be sent right now. Please try again or call us.' };

  // The acknowledgement is a courtesy — its failure does not undo the enquiry.
  // Visitor-typed text is kept out of it (only the course they picked), so it
  // cannot be used to send someone else an arbitrary message.
  const toApplicant = renderEmail({
    preheader: `Enquiry reference ${ref}`,
    heading: 'We have received your enquiry',
    intro:
      'Thank you for your interest in Km. Mayawati Government Girls Polytechnic, Badalpur. Our admission team will contact you within one working day.',
    badge: { label: 'Enquiry reference', value: ref },
    rows: [['Interested course', course]],
    cta: { label: 'Read the admission process', href: `${siteUrl()}/admission/process` },
    footer: 'Admission to all diploma programmes is made through JEECUP counselling. This is an automated message; to add anything, reply to the institute office quoting your reference.',
  });
  await sendMail({ to: email, subject: `Your admission enquiry ${ref} — KMGGP Badalpur`, ...toApplicant });

  return { ok: true, ref };
}
