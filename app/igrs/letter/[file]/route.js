import { findGrievancePublic } from '@/lib/server/igrs';
import { letterRef, readLetter } from '@/lib/server/igrs-letters';

/**
 * Serves a committee letter from the private bucket.
 *
 * The file name carries the grievance's reference number, and the letter is
 * served only if that grievance's history actually lists this file — so a
 * letter is reachable exactly by those who can already open the case on the
 * status page, and by nobody guessing names.
 */
export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { file } = await params;
  const ref = letterRef(file);
  if (!ref) return new Response('Not found', { status: 404 });

  try {
    const grievance = await findGrievancePublic(ref);
    const entry = grievance?.history?.find((h) => h.letter?.file === file);
    if (!entry) return new Response('Not found', { status: 404 });

    const bytes = await readLetter(file);
    if (!bytes) return new Response('Not found', { status: 404 });

    const name = String(entry.letter.name || 'letter.pdf').replace(/["\\\r\n]/g, '');
    return new Response(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(bytes.length),
        'Content-Disposition': `inline; filename="${ref}.pdf"; filename*=UTF-8''${encodeURIComponent(name)}`,
        'Cache-Control': 'private, max-age=300',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('[igrs] letter failed:', error);
    return new Response('Could not load the letter', { status: 502 });
  }
}
