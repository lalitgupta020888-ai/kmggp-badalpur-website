/**
 * How often a visitor is shown the welcome popup.
 *
 * Kept out of the component so the rule can be reasoned about — and tested —
 * on its own. Everything here is browser-side: the "seen" mark lives in the
 * visitor's own storage, never on the server.
 */

/**
 * The storage key for one particular announcement.
 *
 * Salted with the popup's own content, so editing the heading or the message
 * produces a new key. That is what makes a fresh announcement reach people who
 * had already dismissed the previous one — without it, "Once only" would mean
 * once ever, and the second notice the institute published would be invisible.
 */
export function seenKey(popup) {
  const stamp = [popup?.kind, popup?.title, popup?.message, popup?.image, popup?.video].join('|');

  let hash = 0;
  for (let i = 0; i < stamp.length; i += 1) {
    hash = (hash * 31 + stamp.charCodeAt(i)) | 0;
  }
  return `kmggp-welcome-${(hash >>> 0).toString(36)}`;
}

function today(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/** Whether this visitor has already had their allowance of this popup. */
export function alreadySeen(popup, storage, now = new Date()) {
  if (!popup || popup.frequency === 'Every visit') return false;

  try {
    const value = storage?.getItem(seenKey(popup));
    if (!value) return false;
    // "Once only" stores a flag; "Once a day" stores the date it was shown.
    return popup.frequency === 'Once only' ? value === 'seen' : value === today(now);
  } catch {
    // Private browsing can refuse storage. Showing the popup is the safe miss —
    // an extra sighting is a smaller failure than never showing a notice.
    return false;
  }
}

/** Record that this visitor has now seen it. */
export function markSeen(popup, storage, now = new Date()) {
  if (!popup || popup.frequency === 'Every visit') return;

  try {
    storage?.setItem(seenKey(popup), popup.frequency === 'Once only' ? 'seen' : today(now));
  } catch {
    // Nothing to do — it will simply be shown again next time.
  }
}
