import Link from 'next/link';

import { getAlbums, getNotices, getOrders, getTickerNotices } from '@/lib/server/content';
import { listMedia } from '@/lib/server/media';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const [ticker, notices, albums, orders, media] = await Promise.all([
    getTickerNotices(),
    getNotices(),
    getAlbums(),
    getOrders(),
    listMedia(),
  ]);

  const photoCount = albums.reduce((total, album) => total + (album.photos?.length || 0), 0);

  const stats = [
    {
      href: '/admin/news',
      label: 'Ticker items',
      value: ticker.length,
      icon: 'bi-broadcast-pin',
    },
    { href: '/admin/notices', label: 'Notices', value: notices.length, icon: 'bi-megaphone-fill' },
    { href: '/admin/gallery', label: 'Photographs', value: photoCount, icon: 'bi-images' },
    {
      href: '/admin/orders',
      label: 'Documents',
      value: orders.length,
      icon: 'bi-file-earmark-pdf-fill',
    },
    { href: '/admin/media', label: 'Files uploaded', value: media.length, icon: 'bi-collection-fill' },
  ];

  const shortcuts = [
    {
      href: '/admin/gallery',
      icon: 'bi-cloud-arrow-up-fill',
      title: 'Upload photographs',
      body: 'Add pictures to an album — they appear on the gallery and the home page straight away.',
    },
    {
      href: '/admin/news',
      icon: 'bi-broadcast-pin',
      title: 'Post a news update',
      body: 'Add a link to the scrolling announcement line at the top of the home page.',
    },
    {
      href: '/admin/notices',
      icon: 'bi-megaphone-fill',
      title: 'Publish a notice',
      body: 'Put an announcement on the notice board and the notices page.',
    },
    {
      href: '/admin/orders',
      icon: 'bi-file-earmark-arrow-up-fill',
      title: 'Publish a document',
      body: 'Upload an order, circular or government notification as a PDF.',
    },
  ];

  return (
    <>
      <div className="admin-stat-grid">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-stat">
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <i className={`bi ${stat.icon} admin-stat-icon`} />
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <i className="bi bi-lightning-charge-fill head-icon" />
          <div>
            <h2>What would you like to update?</h2>
            <p>Every change goes live on the site the moment you save</p>
          </div>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {shortcuts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="admin-stat"
                style={{ padding: '18px 18px 16px' }}
              >
                <i
                  className={`bi ${item.icon}`}
                  style={{ fontSize: '1.5rem', color: 'var(--gold-600)' }}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-display), Georgia, serif',
                    fontWeight: 700,
                    color: 'var(--navy-800)',
                    marginTop: 8,
                    fontSize: '1rem',
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--ink-soft)', marginTop: 4 }}>
                  {item.body}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <i className="bi bi-info-circle-fill head-icon" />
          <div>
            <h2>How this works</h2>
            <p>Worth reading once</p>
          </div>
        </div>
        <div className="admin-card-body">
          <ul className="mb-0 ps-3" style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.8 }}>
            <li>
              Changes are live as soon as you press <strong>Save</strong> — there is no separate publish
              step and no waiting for the site to rebuild.
            </li>
            <li>
              Every section starts out showing the content the site was built with. Your first save
              replaces it, and <strong>Restore original content</strong> puts it back.
            </li>
            <li>
              Photographs you upload are stored with the site, so you never need to put a file anywhere
              else first.
            </li>
            <li>
              Deleting a file from the media library does not remove it from pages that already use it —
              those will show a broken image, so remove it from the album first.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
