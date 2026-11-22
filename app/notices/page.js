import NoticesView from './NoticesView';
import { unstable_rethrow } from 'next/navigation';
import {
  getNoticeCategories,
  getNotices,
  getOrders,
  getTickerNotices,
} from '@/lib/server/content';
import { getPortalFeed } from '@/lib/server/portals';

export const metadata = {
  title: 'Notices & Orders',
  description:
    'Every notice, announcement and official order published by Km. Mayawati Government Girls Polytechnic, Badalpur — with live updates from BTEUP, JEECUP, the UP and National scholarship portals and AICTE.',
};

export default async function NoticesPage() {
  const [notices, orders, categories, ticker, portal] = await Promise.all([
    getNotices(),
    getOrders(),
    getNoticeCategories(),
    getTickerNotices(),
    getPortalFeed().catch((error) => {
      // Let Next's own render signals (e.g. "this page is dynamic") through.
      unstable_rethrow(error);
      console.error('[portals] feed failed:', error);
      return { notices: [], deadlines: [], status: null };
    }),
  ]);

  return (
    <NoticesView
      notices={notices}
      orders={orders}
      categories={categories}
      ticker={ticker}
      portal={portal}
      renderedAt={new Date().toISOString()}
    />
  );
}
