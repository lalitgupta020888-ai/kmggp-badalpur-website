import { permanentRedirect } from 'next/navigation';

/**
 * The IGRS landing page was removed — the portal now opens straight on the
 * student grievance form, with the other services in the sidebar. This keeps
 * old /igrs links (and any printed material) working.
 */
export default function IgrsIndexPage() {
  permanentRedirect('/igrs/student');
}
