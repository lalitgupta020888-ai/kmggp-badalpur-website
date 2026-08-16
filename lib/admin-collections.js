/**
 * The names of the stored content collections.
 *
 * Kept apart from `lib/server/content.js` because the admin editors run in the
 * browser and need these names to ask for a section to be reset — importing the
 * server module for them would drag the filesystem code into the client bundle.
 */
export const COLLECTIONS = {
  albums: 'gallery-albums',
  notices: 'notices',
  ticker: 'ticker-notices',
  orders: 'orders',
};
