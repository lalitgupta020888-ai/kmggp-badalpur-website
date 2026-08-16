import EnquiryView from './EnquiryView';
import { getSection } from '@/lib/server/sections';

export const metadata = {
  title: 'Admission Enquiry',
  description:
    'Send an admission enquiry to Km. Mayawati Government Girls Polytechnic, Badalpur.',
};

export default async function AdmissionEnquiryPage() {
  const { officeDays, officeTime } = await getSection('institute');

  return <EnquiryView officeHours={`${officeDays}, ${officeTime}`} />;
}
