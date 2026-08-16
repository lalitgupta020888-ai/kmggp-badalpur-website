import { Playfair_Display, Inter } from 'next/font/google';
import SiteFrame from '@/components/SiteFrame';
import { getFeaturedVideoAlbum } from '@/lib/server/content';
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
  const videoAlbum = await getFeaturedVideoAlbum();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteFrame videoAlbum={videoAlbum}>{children}</SiteFrame>
      </body>
    </html>
  );
}
