import { notFound } from 'next/navigation';

import SchemaEditor from '@/components/admin/SchemaEditor';
import { SECTIONS } from '@/lib/sections/schema';
import { getSection } from '@/lib/server/sections';

/**
 * One route serving every schema-described section.
 *
 * Adding an editable area of the site therefore needs no new route, no new
 * page and no new form — only an entry in the schema and a default to fall
 * back to.
 */

export async function generateMetadata({ params }) {
  const { section: key } = await params;
  const section = SECTIONS[key];
  return { title: section ? section.title : 'Not found' };
}

export default async function ContentSectionPage({ params }) {
  const { section: key } = await params;
  const section = SECTIONS[key];
  if (!section) notFound();

  const data = await getSection(key);

  return <SchemaEditor sectionKey={key} section={section} initial={data} />;
}
