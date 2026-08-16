import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { UPLOADS_DIR } from './paths';
import { readCollection, updateCollection } from './store';

export const MEDIA_COLLECTION = 'media';

/** Uploads are capped so one large file cannot fill the disk. */
export const MAX_UPLOAD_BYTES = {
  image: 8 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  video: 150 * 1024 * 1024,
};

const TYPES = [
  { kind: 'image', ext: '.jpg', mime: 'image/jpeg', magic: [[0xff, 0xd8, 0xff]] },
  { kind: 'image', ext: '.png', mime: 'image/png', magic: [[0x89, 0x50, 0x4e, 0x47]] },
  { kind: 'image', ext: '.gif', mime: 'image/gif', magic: [[0x47, 0x49, 0x46, 0x38]] },
  // WebP and MP4 both carry their marker after a 4-byte length/RIFF prefix, so
  // they are matched at an offset rather than at the very start of the file.
  { kind: 'image', ext: '.webp', mime: 'image/webp', magic: [[0x57, 0x45, 0x42, 0x50]], offset: 8 },
  { kind: 'document', ext: '.pdf', mime: 'application/pdf', magic: [[0x25, 0x50, 0x44, 0x46]] },
  { kind: 'video', ext: '.mp4', mime: 'video/mp4', magic: [[0x66, 0x74, 0x79, 0x70]], offset: 4 },
  { kind: 'video', ext: '.webm', mime: 'video/webm', magic: [[0x1a, 0x45, 0xdf, 0xa3]] },
];

/**
 * Work out what a file actually is from its leading bytes.
 *
 * The browser-supplied MIME type and the file extension are both attacker
 * controlled, so neither is trusted here — a `.jpg` that is really a script
 * would otherwise be written into a directory the site serves.
 */
function detectType(buffer) {
  for (const type of TYPES) {
    const offset = type.offset || 0;
    for (const signature of type.magic) {
      if (buffer.length < offset + signature.length) continue;
      if (signature.every((byte, index) => buffer[offset + index] === byte)) {
        return type;
      }
    }
  }
  return null;
}

/** Turn an original filename into something safe and readable to keep as a label. */
function cleanName(name) {
  return (
    path
      .basename(String(name || 'file'))
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9 _-]+/g, '')
      .trim()
      .slice(0, 60) || 'file'
  );
}

/**
 * Store one uploaded file and record it in the media library.
 *
 * Returns the media record, whose `url` is what page content should reference.
 */
export async function saveUpload(file, { alt = '' } = {}) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('No file was received.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) throw new Error('The file is empty.');

  const type = detectType(buffer);
  if (!type) {
    throw new Error('Unsupported file type. Upload a JPG, PNG, WebP, GIF, PDF, MP4 or WebM file.');
  }

  const limit = MAX_UPLOAD_BYTES[type.kind];
  if (buffer.length > limit) {
    throw new Error(
      `That ${type.kind} is ${formatSize(buffer.length)}. The limit is ${formatSize(limit)}.`,
    );
  }

  // The stored filename is generated rather than taken from the upload, so a
  // crafted name can never escape the uploads directory or overwrite a file.
  const label = cleanName(file.name);
  const storedName = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}${type.ext}`;

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, storedName), buffer);

  const record = {
    id: storedName.replace(type.ext, ''),
    file: storedName,
    url: `/media/${storedName}`,
    kind: type.kind,
    mime: type.mime,
    name: label,
    alt: String(alt || '').slice(0, 200),
    size: buffer.length,
    uploadedAt: new Date().toISOString(),
  };

  await updateCollection(MEDIA_COLLECTION, (items) => [record, ...items]);
  return record;
}

/** Every uploaded file, newest first. */
export async function listMedia(kind) {
  const items = (await readCollection(MEDIA_COLLECTION)) || [];
  return kind ? items.filter((item) => item.kind === kind) : items;
}

export async function getMedia(id) {
  const items = await listMedia();
  return items.find((item) => item.id === id) || null;
}

/** Remove a file from the library and from disk. */
export async function deleteMedia(id) {
  let removed = null;

  await updateCollection(MEDIA_COLLECTION, (items) => {
    removed = items.find((item) => item.id === id) || null;
    return items.filter((item) => item.id !== id);
  });

  if (removed) {
    try {
      await fs.unlink(path.join(UPLOADS_DIR, removed.file));
    } catch (error) {
      // The record is already gone; a missing file is not worth failing over.
      if (error.code !== 'ENOENT') console.error('[media] Could not delete file:', error);
    }
  }
  return removed;
}

/** Update the caption/alt text held against a file. */
export async function updateMedia(id, fields) {
  await updateCollection(MEDIA_COLLECTION, (items) =>
    items.map((item) =>
      item.id === id
        ? {
            ...item,
            name: fields.name !== undefined ? String(fields.name).slice(0, 120) : item.name,
            alt: fields.alt !== undefined ? String(fields.alt).slice(0, 200) : item.alt,
          }
        : item,
    ),
  );
}

export function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
