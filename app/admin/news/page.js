import TickerEditor from '@/components/admin/sections/TickerEditor';
import { getTickerNotices } from '@/lib/server/content';

export const metadata = { title: 'News & Updates' };

export default async function AdminNewsPage() {
  const ticker = await getTickerNotices();

  return (
    <>
      <div className="admin-card mb-4">
        <div className="admin-card-head">
          <i className="bi bi-broadcast-pin head-icon" />
          <div>
            <h2>Latest News &amp; Updates</h2>
            <p>The scrolling line under the statistics strip on the home page</p>
          </div>
        </div>
        <div className="admin-card-body">
          <p className="mb-0 text-muted" style={{ fontSize: '0.88rem' }}>
            Each entry becomes a link in the ticker. Put the things visitors arrive looking for here —
            results, counselling, admission — and mark the current ones as <strong>NEW</strong> so they
            carry the gold badge. Four to six entries read best; more than that and each one waits too
            long to come round again.
          </p>
        </div>
      </div>

      <TickerEditor initial={ticker} />
    </>
  );
}
