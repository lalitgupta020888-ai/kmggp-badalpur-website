import MediaLibrary from '@/components/admin/sections/MediaLibrary';
import { listMedia } from '@/lib/server/media';

export const metadata = { title: 'Media Library' };

export default async function AdminMediaPage() {
  const items = await listMedia();

  return (
    <>
      <div className="admin-card mb-4">
        <div className="admin-card-head">
          <i className="bi bi-collection-fill head-icon" />
          <div>
            <h2>Media Library</h2>
            <p>Every photograph, film and document uploaded to the site</p>
          </div>
        </div>
        <div className="admin-card-body">
          <p className="mb-0 text-muted" style={{ fontSize: '0.88rem' }}>
            You do not have to come here to add a photograph — every section that takes an image can
            upload one directly. This page is for seeing everything at once, fixing a description, or
            clearing out files you no longer need.
          </p>
        </div>
      </div>

      <MediaLibrary initial={items} />
    </>
  );
}
