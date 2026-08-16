/**
 * The rotating banner at the top of the home page.
 *
 * Kept here rather than inside the component so the admin panel can edit it.
 * A slide with an empty `src` still runs, over the navy house gradient — the
 * copy stays intact while a photograph is being arranged.
 *
 * `position` decides which part of a photograph survives the crop to the
 * banner's very wide frame. The default centres it; the values used below were
 * chosen per photograph to keep the important part in view.
 */
export const SLIDES = [
  {
    src: '/images/campus.png',
    alt: 'The main entrance of Km. Mayawati Government Girls Polytechnic, Badalpur',
    // A wide panorama in a 2.2:1 hero: cover trims a good part of the width.
    // Anchoring left spends the whole trim on the right edge, so the tree line
    // and the name board survive intact.
    position: 'left center',
    eyebrow: 'Government of Uttar Pradesh',
    icon: 'bi-award-fill',
    title: 'Empowering Women Through Technical Excellence',
    text: 'Km. Mayawati Government Girls Polytechnic, Badalpur — a premier institute shaping confident, industry-ready engineers.',
    primary: { href: '/admission/process', label: 'Apply for Admission', icon: 'bi-mortarboard-fill' },
    secondary: { href: '/about', label: 'Discover the Institute', icon: 'bi-arrow-right' },
  },
  {
    src: '/images/har-ghar-tiranga/rangoli-display.jpg',
    alt: 'Independence Day decorations at KMGGP Badalpur — a tricolour display board and a "Happy Independence Day" rangoli in the campus corridor',
    // A 16:9 frame in a hero that goes much wider than that: cover crops the
    // top and bottom. Biasing above the midpoint keeps the display board whole;
    // the rangoli loses only its lowest edge.
    position: 'center 42%',
    eyebrow: 'Independence Day 2026',
    icon: 'bi-flag-fill',
    title: 'Celebrating the Spirit of Freedom',
    text: 'The campus came alive with rangoli, tricolour displays and student artwork as KMGGP Badalpur marked the 15th of August.',
    primary: { href: '/gallery/har-ghar-tiranga', label: 'View the Album', icon: 'bi-images' },
    secondary: { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
  },
  {
    src: '/images/slider1.png',
    alt: 'The academic block of Km. Mayawati Government Girls Polytechnic, Badalpur',
    // This frame is 2.35:1, so it only crops vertically once the viewport is
    // wide enough to out-stretch it (~1500px up; below that the height fits
    // exactly and this offset is inert). Biasing past the midpoint lifts the
    // photo clear of the headline and keeps the building's base in frame.
    position: 'center 70%',
    eyebrow: 'Our Campus',
    icon: 'bi-building-fill',
    title: 'A Campus Built for Learning',
    text: 'Spacious academic blocks, green surroundings and a safe, well-equipped environment for every student.',
    primary: { href: '/gallery', label: 'View Campus Gallery', icon: 'bi-images' },
    secondary: { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
  },
  {
    src: '/images/slider2.png',
    alt: 'Modern laboratories at Km. Mayawati Government Girls Polytechnic, Badalpur',
    eyebrow: 'World-class Infrastructure',
    icon: 'bi-cpu-fill',
    title: 'State of the Art Laboratories',
    text: 'Hands-on learning across advanced computing, electronics, networking and hardware laboratories.',
    primary: { href: '/admission/courses', label: 'Explore Courses', icon: 'bi-collection-fill' },
    secondary: { href: '/gallery', label: 'View Campus Gallery', icon: 'bi-images' },
  },
  {
    src: '/images/slider3.png',
    alt: 'The institute library',
    eyebrow: 'Knowledge & Research',
    icon: 'bi-book-half',
    title: 'A Rich Foundation of Learning',
    text: 'An extensive library and a serene academic environment with thousands of curated resources.',
    primary: { href: '/placements/records', label: 'Placement Records', icon: 'bi-graph-up-arrow' },
    secondary: { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
  },
];
