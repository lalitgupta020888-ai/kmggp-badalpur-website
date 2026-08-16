import { notFound } from 'next/navigation';

import AlbumView from './AlbumView';
import { getAlbum, getAlbums } from '@/lib/server/content';

export async function generateMetadata({ params }) {
  const { album: slug } = await params;
  const album = await getAlbum(slug);
  if (!album) return { title: 'Album not found' };

  return { title: album.title, description: album.description };
}

export default async function AlbumPage({ params }) {
  const { album: slug } = await params;
  const album = await getAlbum(slug);
  if (!album) notFound();

  const albums = await getAlbums();
  const others = albums.filter((other) => other.slug !== album.slug && other.photos?.length > 0);

  return <AlbumView album={album} others={others} />;
}
