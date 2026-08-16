import PasswordForm from '@/components/admin/sections/PasswordForm';
import { getSession } from '@/lib/server/auth';
import { DATA_DIR } from '@/lib/server/paths';

export const metadata = { title: 'Settings' };

export default async function AdminSettingsPage() {
  const session = await getSession();

  // A relative path means the content is sitting on ordinary container disk,
  // which a redeploy wipes. Worth saying plainly rather than discovering later.
  const persistent = DATA_DIR.startsWith('/') && !DATA_DIR.includes('.data');

  return (
    <>
      <div className="admin-card">
        <div className="admin-card-head">
          <i className="bi bi-person-badge-fill head-icon" />
          <div>
            <h2>Your sign-in</h2>
            <p>Signed in as {session?.username}</p>
          </div>
        </div>
        <div className="admin-card-body">
          <PasswordForm />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <i className="bi bi-hdd-stack-fill head-icon" />
          <div>
            <h2>Where your content is stored</h2>
            <p>Everything you save and upload lives in one folder on the server</p>
          </div>
          <div className="head-actions">
            <span className={`admin-badge ${persistent ? 'live' : ''}`}>
              {persistent ? 'Persistent' : 'Not persistent'}
            </span>
          </div>
        </div>
        <div className="admin-card-body">
          <div className="admin-field">
            <label>Storage folder</label>
            <code
              style={{
                display: 'block',
                padding: '9px 12px',
                background: 'var(--paper)',
                border: '1px solid var(--hairline)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--navy-700)',
              }}
            >
              {DATA_DIR}
            </code>
          </div>

          {!persistent && (
            <div className="admin-flash error mb-0">
              <i className="bi bi-exclamation-triangle-fill" />
              <span>
                This folder is not on a persistent disk, so <strong>everything you save here will
                be lost on the next deployment</strong>. Attach a storage volume mounted at{' '}
                <code>/data</code> and redeploy before entering real content.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
