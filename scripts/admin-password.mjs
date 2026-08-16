#!/usr/bin/env node
/**
 * Generates the two secrets the admin panel needs, for pasting into the hosting
 * environment (Railway → service → Variables).
 *
 *   node scripts/admin-password.mjs --secret            SESSION_SECRET
 *   node scripts/admin-password.mjs "your password"     ADMIN_PASSWORD_HASH
 *
 * The plaintext password is never stored anywhere — only the scrypt hash below
 * goes into the environment, and it cannot be turned back into the password.
 */
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const args = process.argv.slice(2);

if (args.includes('--secret')) {
  console.log('\nSESSION_SECRET=' + randomBytes(48).toString('base64url') + '\n');
  process.exit(0);
}

const password = args[0];

if (!password) {
  console.error(
    '\nUsage:\n' +
      '  node scripts/admin-password.mjs --secret          Generate SESSION_SECRET\n' +
      '  node scripts/admin-password.mjs "your password"   Generate ADMIN_PASSWORD_HASH\n',
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error('\nUse a password of at least 8 characters.\n');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const derived = await scrypt(password, salt, 64);

console.log('\nADMIN_PASSWORD_HASH=scrypt:' + salt + ':' + derived.toString('hex') + '\n');
