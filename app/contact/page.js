import ContactView from './ContactView';
import { getSections } from '@/lib/server/sections';

export const metadata = {
  title: 'Contact Us',
  description:
    'Address, telephone, email and office hours for Km. Mayawati Government Girls Polytechnic, Badalpur.',
};

export default async function ContactPage() {
  const sections = await getSections(['institute', 'topbar']);
  const { officeDays, officeTime } = sections.institute;

  return <ContactView officeHours={`${officeDays}, ${officeTime}`} topbar={sections.topbar} />;
}
