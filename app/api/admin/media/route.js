import { getSession } from '@/lib/server/auth';
import { listMedia } from '@/lib/server/media';

/**
 * The media library, for the picker dialog.
 *
 * The picker needs to re-read the list after an upload without reloading the
 * page the admin is editing, which a server component cannot do on its own.
 */
export async function GET(request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Not authorised' }, { status: 401 });
  }

  const kind = new URL(request.url).searchParams.get('kind');
  const items = await listMedia(kind && kind !== 'all' ? kind : undefined);

  return Response.json(
    { items },
    // Never cached: the list changes on every upload, and it is per-admin data.
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
