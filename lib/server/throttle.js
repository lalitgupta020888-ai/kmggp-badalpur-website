import 'server-only';

/**
 * A small in-memory limiter for the login form.
 *
 * This is deliberately modest: it lives in process memory, so it resets on
 * deploy and is not shared between instances. That is enough to take an online
 * password-guessing run from thousands of tries a minute down to a handful,
 * which — combined with scrypt hashing — is the point. It is not a defence
 * against a distributed attack, and is not meant to be.
 */

const attempts = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function prune(now) {
  for (const [key, entry] of attempts) {
    if (now - entry.first > WINDOW_MS) attempts.delete(key);
  }
}

/** Whether `key` may try again, and how long until the block lifts. */
export function checkAttempts(key) {
  const now = Date.now();
  prune(now);

  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW_MS) return { allowed: true };

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterMinutes: Math.max(1, Math.ceil((WINDOW_MS - (now - entry.first)) / 60000)),
    };
  }
  return { allowed: true };
}

export function recordFailure(key) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { first: now, count: 1 });
  } else {
    entry.count += 1;
  }
}

export function clearAttempts(key) {
  attempts.delete(key);
}
