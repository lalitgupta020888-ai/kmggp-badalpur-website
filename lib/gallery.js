/**
 * Single source of truth for campus photographs.
 *
 * Photographs are grouped into albums. The gallery page lists the albums, each
 * album has its own page, and the home page's gallery band reads the flattened
 * list — so a photograph added to an album once appears everywhere.
 *
 * Every `src` must be a file that actually exists in `public/images/` — a
 * missing file renders as an empty tile rather than an error, which is easy to
 * ship without noticing.
 *
 * To add photographs: drop the files in `public/images/`, then add an entry to
 * the album's `photos` array. To add an album, copy one of the blocks below and
 * give it a new `slug`; the listing page and its route follow automatically.
 */
export const GALLERY_ALBUMS = [
  {
    slug: 'campus',
    title: 'Campus',
    icon: 'bi-buildings-fill',
    description:
      'The main entrance, the academic block and the grounds of the Badalpur campus.',
    photos: [
      { src: '/images/campus.png', caption: 'The Main Entrance' },
      { src: '/images/slider1.png', caption: 'The Academic Block' },
    ],
  },
  {
    slug: 'laboratories',
    title: 'Laboratories',
    icon: 'bi-cpu-fill',
    description: 'Computing, electronics and networking laboratories used across the three branches.',
    photos: [{ src: '/images/slider2.png', caption: 'Advanced Computing Laboratory' }],
  },
  {
    slug: 'library',
    title: 'Library',
    icon: 'bi-book-half',
    description: 'The reading hall, book stacks and the reference section.',
    photos: [{ src: '/images/slider3.png', caption: 'The Institute Library' }],
  },
];

export function getAlbum(slug) {
  return GALLERY_ALBUMS.find((album) => album.slug === slug) || null;
}

/** The first photograph of an album stands as its cover. */
export const albumCover = (album) => album.photos[0]?.src;

/**
 * Every photograph, flattened, each carrying its album title as its tag. The
 * home page band and any other whole-gallery view read this.
 */
export const GALLERY_IMAGES = GALLERY_ALBUMS.flatMap((album) =>
  album.photos.map((photo) => ({ ...photo, tag: album.title, album: album.slug }))
);
