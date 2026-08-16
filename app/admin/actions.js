'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin, setCredentials, checkCredentials, getSession } from '@/lib/server/auth';
import { COLLECTIONS } from '@/lib/server/content';
import { deleteMedia, saveUpload, updateMedia } from '@/lib/server/media';
import { resetCollection, writeCollection, newId } from '@/lib/server/store';
import * as s from '@/lib/server/sanitise';

/**
 * Everything the admin panel writes goes through one of these.
 *
 * Each action re-checks the session for itself — a server action is a public
 * POST endpoint, so the layout's redirect does nothing to protect it.
 */

/**
 * Content changes can appear on any page — a photograph shows on the album, the
 * gallery index and the home page band — so the whole tree is revalidated
 * rather than trying to name the affected routes and eventually missing one.
 */
function publish() {
  revalidatePath('/', 'layout');
}

function ok(message) {
  return { ok: true, message };
}

function fail(message) {
  return { ok: false, message };
}

/** Wraps an action so a thrown error becomes a message instead of a crash. */
async function guarded(work) {
  try {
    await requireAdmin();
  } catch {
    return fail('Your session has expired. Please sign in again.');
  }

  try {
    return await work();
  } catch (error) {
    console.error('[admin]', error);
    return fail(error?.message || 'Something went wrong. Please try again.');
  }
}

/* ---------------------------- News & Updates ---------------------------- */

export async function saveTicker(items) {
  return guarded(async () => {
    const cleaned = s.list(items, (item) => {
      const title = s.text(item.title, 120);
      if (!title) return null;
      const href = s.link(item.link);
      return {
        id: s.text(item.id, 40) || newId(),
        title,
        icon: s.icon(item.icon, 'bi-megaphone-fill'),
        isNew: s.flag(item.isNew),
        link: href,
        external: s.isExternal(href),
      };
    });

    await writeCollection(COLLECTIONS.ticker, cleaned);
    publish();
    return ok(`Saved ${cleaned.length} ticker item${cleaned.length === 1 ? '' : 's'}.`);
  });
}

/* ------------------------------- Notices -------------------------------- */

export async function saveNotices(items) {
  return guarded(async () => {
    const cleaned = s.list(items, (item) => {
      const title = s.text(item.title, 220);
      if (!title) return null;
      const href = s.link(item.link);
      return {
        id: s.text(item.id, 40) || newId(),
        title,
        date: s.text(item.date, 40),
        icon: s.icon(item.icon, 'bi-megaphone-fill'),
        category: s.text(item.category, 40),
        isNew: s.flag(item.isNew),
        link: href,
        external: s.isExternal(href),
      };
    });

    await writeCollection(COLLECTIONS.notices, cleaned);
    publish();
    return ok(`Saved ${cleaned.length} notice${cleaned.length === 1 ? '' : 's'}.`);
  });
}

/* ---------------------------- Orders / PDFs ----------------------------- */

export async function saveOrders(items) {
  return guarded(async () => {
    const cleaned = s.list(items, (item) => {
      const title = s.text(item.title, 200);
      const file = s.link(item.file);
      if (!title || !file) return null;
      return {
        id: s.text(item.id, 40) || newId(),
        title,
        note: s.multiline(item.note, 400),
        icon: s.icon(item.icon, 'bi-file-earmark-pdf-fill'),
        file,
      };
    });

    await writeCollection(COLLECTIONS.orders, cleaned);
    publish();
    return ok(`Saved ${cleaned.length} document${cleaned.length === 1 ? '' : 's'}.`);
  });
}

/* -------------------------------- Gallery ------------------------------- */

export async function saveAlbums(items) {
  return guarded(async () => {
    const cleaned = s.uniqueSlugs(
      s.list(items, (album) => {
        const title = s.text(album.title, 120);
        if (!title) return null;

        const video = s.link(album.video?.src)
          ? {
              src: s.link(album.video.src),
              poster: s.link(album.video.poster),
              caption: s.text(album.video.caption, 160),
            }
          : null;

        const record = {
          slug: s.slug(album.slug || title, 'album'),
          title,
          icon: s.icon(album.icon, 'bi-images'),
          description: s.multiline(album.description, 600),
          photos: s.list(album.photos, (photo) => {
            const src = s.link(photo.src);
            return src ? { src, caption: s.text(photo.caption, 160) } : null;
          }),
        };

        if (video) record.video = video;
        return record;
      }),
    );

    await writeCollection(COLLECTIONS.albums, cleaned);
    publish();
    return ok(`Saved ${cleaned.length} album${cleaned.length === 1 ? '' : 's'}.`);
  });
}

/* --------------------------------- Media -------------------------------- */

export async function uploadFiles(formData) {
  return guarded(async () => {
    const files = formData.getAll('files').filter((entry) => typeof entry?.arrayBuffer === 'function');
    if (files.length === 0) return fail('Choose at least one file to upload.');

    const saved = [];
    const errors = [];

    for (const file of files) {
      try {
        saved.push(await saveUpload(file));
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    publish();

    if (saved.length === 0) return fail(errors.join(' '));
    return {
      ok: true,
      items: saved,
      message: errors.length
        ? `Uploaded ${saved.length}. ${errors.length} failed — ${errors.join(' ')}`
        : `Uploaded ${saved.length} file${saved.length === 1 ? '' : 's'}.`,
    };
  });
}

export async function removeMedia(id) {
  return guarded(async () => {
    const removed = await deleteMedia(s.text(id, 60));
    if (!removed) return fail('That file was not found.');
    publish();
    return ok(`Deleted ${removed.name}.`);
  });
}

export async function renameMedia(id, fields) {
  return guarded(async () => {
    await updateMedia(s.text(id, 60), {
      name: s.text(fields?.name, 120),
      alt: s.text(fields?.alt, 200),
    });
    publish();
    return ok('Saved.');
  });
}

/* -------------------------------- Settings ------------------------------ */

export async function changePassword(_previous, formData) {
  return guarded(async () => {
    const session = await getSession();
    const current = String(formData.get('current') || '');
    const next = String(formData.get('next') || '');
    const confirm = String(formData.get('confirm') || '');

    if (!(await checkCredentials(session.username, current))) {
      return fail('Your current password is not correct.');
    }
    if (next.length < 10) {
      return fail('Choose a new password of at least 10 characters.');
    }
    if (next !== confirm) {
      return fail('The two new passwords do not match.');
    }

    await setCredentials(session.username, next);
    return ok('Password changed. It applies the next time you sign in.');
  });
}

/** Drop a collection's saved records so it falls back to the built-in list. */
export async function restoreDefaults(collection) {
  return guarded(async () => {
    const allowed = Object.values(COLLECTIONS);
    if (!allowed.includes(collection)) return fail('Unknown section.');

    await resetCollection(collection);
    publish();
    return ok('Restored the original content that shipped with the site.');
  });
}
