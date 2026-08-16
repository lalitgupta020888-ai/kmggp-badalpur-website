import NoticesView from './NoticesView';
import {
  getNoticeCategories,
  getNotices,
  getOrders,
  getTickerNotices,
} from '@/lib/server/content';

export const metadata = {
  title: 'Notices & Orders',
  description:
    'Every notice, announcement and official order published by Km. Mayawati Government Girls Polytechnic, Badalpur.',
};

export default async function NoticesPage() {
  const [notices, orders, categories, ticker] = await Promise.all([
    getNotices(),
    getOrders(),
    getNoticeCategories(),
    getTickerNotices(),
  ]);

  return (
    <NoticesView notices={notices} orders={orders} categories={categories} ticker={ticker} />
  );
}
