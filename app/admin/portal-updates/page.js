import SyncPortalsButton from '@/components/admin/sections/SyncPortalsButton';
import { PORTALS } from '@/lib/portals';
import { getPortalFeed } from '@/lib/server/portals';

export const metadata = { title: 'Portal Updates' };

function when(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminPortalUpdatesPage() {
  const { notices, deadlines, status } = await getPortalFeed();

  return (
    <>
      <div className="admin-card mb-4">
        <div className="admin-card-head">
          <i className="bi bi-broadcast head-icon" aria-hidden="true" />
          <div>
            <h2>Automatic Portal Updates</h2>
            <p>Read from the official portals and shown on the notice board, the ticker and /notices</p>
          </div>
          <div className="head-actions">
            <SyncPortalsButton />
          </div>
        </div>
        <div className="admin-card-body">
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>
            Nothing to enter here — the site reads BTEUP, JEECUP, UP Scholarship, the National
            Scholarship Portal and AICTE by itself: once a day on a schedule, and again whenever a
            visitor opens a page and the copy is more than two hours old. If a portal is down, its
            last good updates stay on the site. Use <strong>Sync now</strong> after an important
            announcement to bring it in straight away.
          </p>
          <p className="mb-0 small">
            Last attempt: <strong>{when(status?.lastAttempt)}</strong> · {notices.length} updates ·{' '}
            {deadlines.length} open last dates
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <i className="bi bi-hdd-network head-icon" aria-hidden="true" />
          <div>
            <h2>Portals</h2>
            <p>When each one was last read successfully</p>
          </div>
        </div>
        <div className="admin-card-body p-0">
          <table className="table mb-0" style={{ fontSize: '0.88rem' }}>
            <thead>
              <tr>
                <th>Portal</th>
                <th>Status</th>
                <th>Updates</th>
                <th>Last successful read</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(PORTALS).map(([key, portal]) => {
                const s = status?.sources?.[key];
                return (
                  <tr key={key}>
                    <td>
                      <i className={`bi ${portal.icon} me-2`} aria-hidden="true" />
                      <a href={portal.all} target="_blank" rel="noopener noreferrer">{portal.label}</a>
                    </td>
                    <td>
                      {!s ? (
                        <span className="admin-badge">Not synced yet</span>
                      ) : s.ok ? (
                        <span className="admin-badge live">Working</span>
                      ) : (
                        <span className="admin-badge" title={s.error} style={{ background: '#fbe3e3', color: '#a52222' }}>
                          Not responding
                        </span>
                      )}
                      {s && !s.ok && s.error && <div className="small text-muted mt-1">{s.error}</div>}
                    </td>
                    <td>{notices.filter((n) => n.source === key).length}</td>
                    <td>{when(s?.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
