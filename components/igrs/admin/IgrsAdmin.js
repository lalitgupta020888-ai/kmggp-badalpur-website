"use client";

import React, { useCallback, useState, useSyncExternalStore } from 'react';
import IgrsShell from '@/components/igrs/IgrsShell';
import {
  clearAdminSession,
  getAdminSessionServerSnapshot,
  getAdminSessionSnapshot,
  setAdminSession,
  subscribeAdminSession,
} from '@/lib/igrs';
import { igrsSignOut } from '@/app/igrs/admin/actions';
import { AdminLogin } from './AuthPanels';
import Dashboard from './Dashboard';

/**
 * The committee page: the login (with forgot-password) or the dashboard.
 *
 * Whether to show the dashboard is a browser-side flag, read as an external
 * store so no mount effect is needed. It is only a hint for the UI — every
 * committee action checks the httpOnly session cookie on the server, and a
 * lapsed session sends the member back here.
 */
export default function IgrsAdmin({ options }) {
  const isAdmin = useSyncExternalStore(
    subscribeAdminSession,
    getAdminSessionSnapshot,
    getAdminSessionServerSnapshot,
  );
  const [notice, setNotice] = useState('');

  const signOut = useCallback((message = '') => {
    igrsSignOut().catch(() => {});
    setNotice(message);
    clearAdminSession();
  }, []);

  return (
    <IgrsShell
      icon="bi-person-lock"
      title={isAdmin ? 'Committee Dashboard' : 'Committee Login'}
      crumb={isAdmin ? 'Dashboard' : 'Admin Login'}
      subtitle={
        isAdmin
          ? 'Review every grievance received, update its status and record the committee remarks.'
          : 'Grievance committee members sign in here to review and update submitted cases.'
      }
      wide={isAdmin}
    >
      {isAdmin ? (
        <Dashboard onLogout={signOut} options={options} />
      ) : (
        <AdminLogin key={notice} notice={notice} onSuccess={setAdminSession} />
      )}
    </IgrsShell>
  );
}
