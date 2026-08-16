import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import { getSession } from '@/lib/server/auth';
import './admin.css';

export const metadata = {
  title: 'Admin Panel',
  // The panel must never be indexed, and its pages must never be cached by a
  // proxy that could then hand one admin's view to somebody else.
  robots: { index: false, follow: false },
};

/**
 * Every `/admin` route renders inside here, so an unauthenticated visitor is
 * turned away before any admin page runs.
 *
 * This guard covers rendering only. Server actions and route handlers are
 * reachable without rendering a page, so each of those calls `requireAdmin()`
 * for itself rather than trusting this.
 */
export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return <AdminShell username={session.username}>{children}</AdminShell>;
}
