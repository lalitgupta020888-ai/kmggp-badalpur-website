import { Playfair_Display, Inter } from 'next/font/google';
import SiteFrame from '@/components/SiteFrame';
import { getFeaturedVideoAlbum } from '@/lib/server/content';
import { getSections } from '@/lib/server/sections';
import './globals.css';

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Km. Mayawati Government Girls Polytechnic, Badalpur',
    template: '%s | Km. Mayawati Government Girls Polytechnic, Badalpur',
  },
  description:
    'Official website of Km. Mayawati Government Girls Polytechnic, Badalpur, Gautam Buddha Nagar — approved by AICTE, affiliated to BTEUP, empowering women through excellence in technical education.',
};

export default async function RootLayout({ children }) {
  // The header and footer wrap every page, so their content is read once here
  // rather than in each of the sixty routes underneath.
  const [videoAlbum, sections] = await Promise.all([
    getFeaturedVideoAlbum(),
    getSections([
      'nav-menus',
      'nav-actions',
      'topbar',
      'social-links',
      'brand',
      'institute',
      'welcome-popup',
    ]),
  ]);

  // The popup is a client component, so whatever is handed to it travels to
  // every visitor's browser in the page payload. An announcement that is
  // switched off — or one being drafted — has no business being sent, so the
  // props are decided here and only what is actually shown goes out.
  const popupSection = sections['welcome-popup'];
  const usesGalleryFilm = popupSection?.kind === 'Gallery film';
  const popup = popupSection?.enabled ? popupSection : null;

  const institute = sections.institute;
  const chrome = {
    menus: sections['nav-menus'],
    actions: sections['nav-actions'],
    topbar: sections.topbar,
    social: sections['social-links'],
    brand: sections.brand,
    officeHours: `${institute.officeDays}, ${institute.officeTime}`,
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteFrame
          videoAlbum={popup && usesGalleryFilm ? videoAlbum : null}
          popup={popup}
          chrome={chrome}
        >
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}
