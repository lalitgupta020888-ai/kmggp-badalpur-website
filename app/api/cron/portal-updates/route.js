import { syncPortals } from '@/lib/server/portals';

/**
 * Daily refresh of the government-portal updates, called by Vercel Cron (see
 * vercel.json). Vercel signs the request with `Authorization: Bearer
 * $CRON_SECRET` when CRON_SECRET is set; with it set, nothing else can call
 * this. Without it the route still works but is rate-limited by the sync
 * itself (one run per 10 minutes), so it cannot be used to hammer the portals.
 */

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const authorised = secret && request.headers.get('authorization') === `Bearer ${secret}`;
  if (secret && !authorised) return new Response('Unauthorized', { status: 401 });

  try {
    const status = await syncPortals({ force: Boolean(authorised) });
    return Response.json({ ok: true, status });
  } catch (error) {
    console.error('[portals] cron sync failed:', error);
    return Response.json({ ok: false, error: 'Sync failed' }, { status: 500 });
  }
}
