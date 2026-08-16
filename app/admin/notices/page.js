import NoticesEditor from '@/components/admin/sections/NoticesEditor';
import { getNoticeCategories, getNotices } from '@/lib/server/content';

export const metadata = { title: 'Notice Board' };

/** Offered in the category box even before any notice uses them. */
const SUGGESTED = ['Admissions', 'Academics', 'Placements', 'Events', 'Scholarships', 'Examinations'];

export default async function AdminNoticesPage() {
  const [notices, used] = await Promise.all([getNotices(), getNoticeCategories()]);
  const categories = [...new Set([...used, ...SUGGESTED])];

  return (
    <>
      <div className="admin-card mb-4">
        <div className="admin-card-head">
          <i className="bi bi-megaphone-fill head-icon" />
          <div>
            <h2>Notice Board</h2>
            <p>Shown on the home page panel and in full on /notices</p>
          </div>
        </div>
        <div className="admin-card-body">
          <p className="mb-0 text-muted" style={{ fontSize: '0.88rem' }}>
            The home page shows the first few notices in this order, so put the most important one at
            the top. The <strong>category</strong> you give a notice becomes a filter button on the
            notices page — reuse an existing name to group notices together rather than inventing a new
            one each time.
          </p>
        </div>
      </div>

      <NoticesEditor initial={notices} categories={categories} />
    </>
  );
}
