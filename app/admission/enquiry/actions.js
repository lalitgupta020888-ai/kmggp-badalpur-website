'use server';

import { clean, guardForm } from '@/lib/server/form-guard';
import { institutionInbox, isEmail, renderEmail, sendMail } from '@/lib/server/mail';

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
  if (guard.silent) return { ok: true };
  if (!guard.ok) return { error: guard.error };

  const name = clean(data?.name, 120);
  const mobile = clean(data?.mobile, 15);
  const email = clean(data?.email, 200);
  const course = COURSES[clean(data?.course)] || '';
  const class10 = CLASS10[clean(data?.class10)] || '';
  const city = clean(data?.city, 120);
  const query = clean(data?.query, 3000);

  if (!name || !course || !class10) return { error: 'Please fill in every required field.' };
  if (!/^[0-9]{10}$/.test(mobile)) return { error: 'Please enter a 10-digit mobile number.' };
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

  const toOffice = renderEmail({
    heading: 'New admission enquiry',
    intro: 'Submitted through the Admission Enquiry form. Reply to this email to answer the applicant.',
    rows,
  });

  const sent = await sendMail({
    to: await institutionInbox(),
    subject: `Admission enquiry: ${name} (${course})`,
    ...toOffice,
    replyTo: email,
  });
  if (!sent) return { error: 'Your enquiry could not be sent right now. Please try again or call us.' };

  // The acknowledgement is a courtesy — its failure does not undo the enquiry.
  const toApplicant = renderEmail({
    heading: 'We have received your enquiry',
    intro: `Dear ${name}, thank you for your interest in Km. Mayawati Government Girls Polytechnic, Badalpur. Our admission team will contact you within one working day.`,
    rows: [
      ['Interested course', course],
      ['Mobile', mobile],
    ],
    footer: 'Admission to all diploma programmes is made through JEECUP counselling. This is an automated message.',
  });
  await sendMail({ to: email, subject: 'Your admission enquiry — KMGGP Badalpur', ...toApplicant });

  return { ok: true };
}
