/**
 * Single source of truth for campus photographs.
 *
 * Both the gallery page and the home page's gallery preview read from here, so
 * a photograph added once appears in both. Every `src` must be a file that
 * actually exists in `public/images/` — a missing file renders as an empty
 * tile rather than an error, which is easy to ship without noticing.
 */
export const GALLERY_IMAGES = [
  {
    src: '/images/campus.png',
    caption: 'The Main Entrance',
    tag: 'Campus',
  },
  {
    src: '/images/slider2.png',
    caption: 'Advanced Computing Laboratory',
    tag: 'Laboratories',
  },
  {
    src: '/images/slider3.png',
    caption: 'The Institute Library',
    tag: 'Library',
  },
  {
    src: '/images/slider1.png',
    caption: 'The Academic Block',
    tag: 'Campus',
  },
];
