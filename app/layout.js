import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'Km. Mayawati Government Girls Polytechnic, Badalpur',
  description: 'Official website of Km. Mayawati Government Girls Polytechnic, Badalpur, Gautam Buddha Nagar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
