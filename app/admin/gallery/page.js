import GalleryEditor from '@/components/admin/sections/GalleryEditor';
import { getAlbums } from '@/lib/server/content';

export const metadata = { title: 'Photos & Gallery' };

export default async function AdminGalleryPage() {
  const albums = await getAlbums();

  return (
    <>
      <div className="admin-card mb-4">
        <div className="admin-card-head">
          <i className="bi bi-images head-icon" />
          <div>
            <h2>Photographs &amp; Albums</h2>
            <p>The gallery page, each album&apos;s own page, and the band on the home page</p>
          </div>
        </div>
        <div className="admin-card-body">
          <p className="mb-0 text-muted" style={{ fontSize: '0.88rem' }}>
            Open an album and use <strong>Upload / add photographs</strong> — you can select several
            files at once. The first photograph in an album is its cover, so drag the one you want on
            the gallery page into first position. Every photograph you add appears in the album, on the
            gallery index and in the home page band without any further step.
          </p>
        </div>
      </div>

      <GalleryEditor initial={albums} />
    </>
  );
}
