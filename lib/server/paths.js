import 'server-only';

import path from 'node:path';

/**
 * Everything the admin panel writes — content records and uploaded files — lives
 * under one directory so it can be pointed at a persistent disk in production.
 *
 * On Railway, attach a volume mounted at `/data` and the default below picks it
 * up. Locally there is no volume, so it falls back to `.data/` in the project
 * root (git-ignored). Set `DATA_DIR` to override either.
 *
 * This must be a directory that survives a redeploy. If it points at ordinary
 * container disk, every deploy silently resets the site's content back to the
 * built-in defaults.
 */
export const DATA_DIR =
  process.env.DATA_DIR || (process.env.RAILWAY_ENVIRONMENT ? '/data' : path.join(process.cwd(), '.data'));

/** Content records, one JSON file per collection. */
export const RECORDS_DIR = path.join(DATA_DIR, 'records');

/** Uploaded photographs, videos and documents. */
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
