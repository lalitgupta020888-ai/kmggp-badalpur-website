/**
 * Every editable part of the site, described as data.
 *
 * The admin panel builds itself from this: the sidebar, the routes under
 * `/admin/content/…`, the forms, and the server-side validation all read the
 * same definitions. Making something on the site editable is a matter of adding
 * an entry here plus a default in `lib/server/section-defaults.js` — not of
 * writing another form by hand.
 *
 * This file is imported by browser code, so it holds **data only**. Anything
 * that needs the filesystem lives on the server side.
 *
 * Field types: text · textarea · link · icon · check · select · number ·
 * media (with `kind`) · items (a nested list with its own `fields`).
 */

const iconField = (name = 'icon', label = 'Icon') => ({ name, label, type: 'icon' });

export const SECTIONS = {
  /* ------------------------------ Navigation ----------------------------- */

  'nav-menus': {
    collection: 'nav-menus',
    title: 'Main Menu',
    icon: 'bi-list-nested',
    group: 'Navigation',
    type: 'list',
    addLabel: 'Add menu',
    intro:
      'The menus across the top of every page. A menu with dropdown items opens on hover; a menu with only a link goes straight to that page. Order here is the order in the bar.',
    summary: { title: 'label', meta: ['href'], count: 'items', countLabel: 'links' },
    fields: [
      { name: 'label', label: 'Menu name', type: 'text', full: true, placeholder: 'Academics' },
      {
        name: 'href',
        label: 'Direct link',
        type: 'link',
        full: true,
        placeholder: '/gallery',
        hint: 'Only for a menu with no dropdown. Leave blank if you add items below.',
      },
      {
        name: 'items',
        label: 'Dropdown items',
        type: 'items',
        full: true,
        addLabel: 'Add link',
        fields: [
          { name: 'label', label: 'Link text', type: 'text' },
          { name: 'href', label: 'Goes to', type: 'link', placeholder: '/academic/calendar' },
          iconField(),
        ],
      },
    ],
  },

  'nav-actions': {
    collection: 'nav-actions',
    title: 'Menu Buttons',
    icon: 'bi-ui-radios',
    group: 'Navigation',
    type: 'list',
    addLabel: 'Add button',
    intro:
      'The buttons at the right-hand end of the menu bar — Admin Login, IGRS, Admission Enquiry and Counselling.',
    summary: { title: 'label', meta: ['href', 'style'] },
    fields: [
      { name: 'label', label: 'Button text', type: 'text' },
      {
        name: 'shortLabel',
        label: 'Short text',
        type: 'text',
        hint: 'Used on narrow screens where the full text will not fit.',
      },
      { name: 'href', label: 'Goes to', type: 'link', full: true },
      iconField(),
      {
        name: 'style',
        label: 'Appearance',
        type: 'select',
        options: ['ghost', 'cta', 'highlight'],
        hint: 'ghost = plain outline · cta = gold · highlight = filled accent',
      },
    ],
  },

  topbar: {
    collection: 'topbar',
    title: 'Contact Strip',
    icon: 'bi-telephone-fill',
    group: 'Navigation',
    type: 'single',
    intro:
      'The thin strip above the menu, carrying the address, phone number and email. These also appear elsewhere on the site.',
    fields: [
      { name: 'address', label: 'Address', type: 'text', full: true },
      { name: 'phone', label: 'Phone (as shown)', type: 'text' },
      {
        name: 'phoneHref',
        label: 'Phone (dialled)',
        type: 'text',
        placeholder: 'tel:+919999999999',
        hint: 'What a tap on a phone actually dials.',
      },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'staffLabel', label: 'Staff link text', type: 'text' },
      { name: 'staffHref', label: 'Staff link goes to', type: 'link' },
      { name: 'accreditation', label: 'Accreditation line', type: 'text', full: true },
    ],
  },

  'social-links': {
    collection: 'social-links',
    title: 'Social Links',
    icon: 'bi-share-fill',
    group: 'Navigation',
    type: 'list',
    addLabel: 'Add profile',
    intro: 'Social profiles in the top strip and the footer. Leave a link blank to hide that icon.',
    summary: { title: 'label', meta: ['href'] },
    fields: [
      { name: 'label', label: 'Network', type: 'text' },
      iconField(),
      { name: 'href', label: 'Profile link', type: 'link', full: true },
    ],
  },

  brand: {
    collection: 'brand',
    title: 'Logo & Name',
    icon: 'bi-award-fill',
    group: 'Navigation',
    type: 'single',
    intro: 'The crest and the institute name shown at the left of the menu bar.',
    fields: [
      { name: 'logo', label: 'Crest / logo', type: 'media', kind: 'image', full: true },
      { name: 'line1', label: 'Name — first line', type: 'text' },
      { name: 'line2', label: 'Name — second line', type: 'text' },
    ],
  },

  /* ------------------------------ Home page ------------------------------ */

  'hero-slides': {
    collection: 'hero-slides',
    title: 'Hero Slider',
    icon: 'bi-images',
    group: 'Home Page',
    type: 'list',
    addLabel: 'Add slide',
    intro:
      'The large rotating banner at the top of the home page. A slide with no photograph still runs, over the navy house gradient.',
    summary: { title: 'title', meta: ['eyebrow'], thumb: 'src' },
    fields: [
      { name: 'title', label: 'Headline', type: 'text', full: true },
      { name: 'text', label: 'Supporting line', type: 'textarea', full: true },
      { name: 'src', label: 'Photograph', type: 'media', kind: 'image', full: true },
      {
        name: 'alt',
        label: 'Photograph description',
        type: 'text',
        full: true,
        hint: 'Read aloud by screen readers. Describe what the picture shows.',
      },
      { name: 'eyebrow', label: 'Small line above the headline', type: 'text' },
      iconField(),
      {
        name: 'position',
        label: 'Photograph framing',
        type: 'select',
        options: ['center center', 'left center', 'right center', 'center 42%', 'center 70%'],
        hint: 'Which part of the photograph to keep when it is cropped to the banner.',
      },
      { name: 'primaryLabel', label: 'Main button text', type: 'text' },
      { name: 'primaryHref', label: 'Main button goes to', type: 'link' },
      iconField('primaryIcon', 'Main button icon'),
      { name: 'secondaryLabel', label: 'Second button text', type: 'text' },
      { name: 'secondaryHref', label: 'Second button goes to', type: 'link' },
      iconField('secondaryIcon', 'Second button icon'),
    ],
  },

  'home-stats': {
    collection: 'home-stats',
    title: 'Key Figures',
    icon: 'bi-graph-up-arrow',
    group: 'Home Page',
    type: 'list',
    addLabel: 'Add figure',
    intro: 'The strip of numbers directly under the hero banner.',
    summary: { title: 'label', meta: ['value'] },
    fields: [
      { name: 'value', label: 'Figure', type: 'text', placeholder: '500+' },
      { name: 'label', label: 'Caption', type: 'text', placeholder: 'Students Enrolled' },
      iconField(),
    ],
  },

  'home-highlights': {
    collection: 'home-highlights',
    title: 'Highlight Cards',
    icon: 'bi-grid-1x2-fill',
    group: 'Home Page',
    type: 'list',
    addLabel: 'Add card',
    intro: 'The four cards linking to the sections visitors ask for most.',
    summary: { title: 'title', meta: ['href'] },
    fields: [
      { name: 'title', label: 'Card title', type: 'text', full: true },
      { name: 'text', label: 'Description', type: 'textarea', full: true },
      { name: 'href', label: 'Goes to', type: 'link' },
      iconField(),
    ],
  },

  'home-pillars': {
    collection: 'home-pillars',
    title: 'Why Choose Us',
    icon: 'bi-patch-check-fill',
    group: 'Home Page',
    type: 'list',
    addLabel: 'Add point',
    intro: 'The strengths listed in the welcome section.',
    summary: { title: 'title' },
    fields: [
      { name: 'title', label: 'Heading', type: 'text', full: true },
      { name: 'text', label: 'Description', type: 'textarea', full: true },
      iconField(),
    ],
  },

  'home-departments': {
    collection: 'home-departments',
    title: 'Department Cards',
    icon: 'bi-diagram-3-fill',
    group: 'Home Page',
    type: 'list',
    addLabel: 'Add department card',
    intro: 'The department cards on the home page. These are separate from the department pages themselves.',
    summary: { title: 'name', meta: ['href'], thumb: 'image' },
    fields: [
      { name: 'name', label: 'Department', type: 'text', full: true },
      { name: 'text', label: 'Description', type: 'textarea', full: true },
      { name: 'href', label: 'Goes to', type: 'link' },
      iconField(),
      {
        name: 'image',
        label: 'Background photograph',
        type: 'media',
        kind: 'image',
        full: true,
        hint: 'Optional. A darker photograph suits the card treatment best.',
      },
    ],
  },

  leadership: {
    collection: 'leadership',
    title: 'Leadership',
    icon: 'bi-people-fill',
    group: 'Home Page',
    type: 'list',
    addLabel: 'Add dignitary',
    intro:
      'The dignitaries shown on the home page. When a post changes hands, edit the name, designation and photograph here — nothing else needs touching. A card with no photograph shows a gold monogram instead.',
    summary: { title: 'name', meta: ['role', 'org'], thumb: 'photo' },
    fields: [
      { name: 'name', label: 'Full name', type: 'text', full: true, placeholder: 'Shri Yogi Adityanath' },
      { name: 'role', label: 'Designation', type: 'text', placeholder: "Hon'ble Chief Minister" },
      { name: 'org', label: 'Department / Government', type: 'text' },
      { name: 'photo', label: 'Photograph', type: 'media', kind: 'image', full: true },
    ],
  },

  'leadership-heading': {
    collection: 'leadership-heading',
    title: 'Leadership Heading',
    icon: 'bi-type-h1',
    group: 'Home Page',
    type: 'single',
    intro: 'The heading above the leadership grid.',
    fields: [
      { name: 'eyebrow', label: 'Small line above', type: 'text' },
      { name: 'title', label: 'Heading', type: 'text' },
      { name: 'subtitle', label: 'Sub-heading', type: 'textarea', full: true },
    ],
  },

  'principal-card': {
    collection: 'principal-card',
    title: "Principal's Card",
    icon: 'bi-person-video2',
    group: 'Home Page',
    type: 'single',
    intro:
      'The Principal’s Message panel under the notice board. When a new Principal takes charge, change the name, designation, photograph and quotation here.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', placeholder: 'Dr. A. B. Sharma' },
      { name: 'role', label: 'Designation', type: 'text', placeholder: 'Principal' },
      { name: 'photo', label: 'Photograph', type: 'media', kind: 'image', full: true },
      { name: 'quote', label: 'Quotation', type: 'textarea', full: true },
      { name: 'linkLabel', label: 'Button text', type: 'text' },
    ],
  },

  testimonials: {
    collection: 'testimonials',
    title: 'Student Voices',
    icon: 'bi-chat-quote-fill',
    group: 'Home Page',
    type: 'list',
    addLabel: 'Add testimonial',
    intro: 'What students say, shown near the foot of the home page.',
    summary: { title: 'name', meta: ['meta'] },
    fields: [
      { name: 'quote', label: 'What they said', type: 'textarea', full: true },
      { name: 'name', label: 'Student name', type: 'text' },
      { name: 'meta', label: 'Branch and batch', type: 'text', placeholder: 'CSE, Batch of 2025' },
    ],
  },

  /* ------------------------------ Institute ------------------------------ */

  institute: {
    collection: 'institute',
    title: 'Institute Details',
    icon: 'bi-buildings-fill',
    group: 'Institute',
    type: 'single',
    intro:
      'Facts that appear across many pages. Office hours in particular are read by the contact page, the library page, the admission enquiry page and the footer — change them once here.',
    fields: [
      { name: 'officeDays', label: 'Office days', type: 'text', placeholder: 'Monday – Saturday' },
      { name: 'officeTime', label: 'Office hours', type: 'text', placeholder: '10:00 AM – 5:00 PM' },
      { name: 'mapLat', label: 'Map latitude', type: 'text', placeholder: '28.593145' },
      { name: 'mapLng', label: 'Map longitude', type: 'text', placeholder: '77.51895' },
      { name: 'mapName', label: 'Address shown under the map', type: 'textarea', full: true },
    ],
  },

  /* ------------------------------ Academics ------------------------------ */

  timetable: {
    collection: 'timetable',
    title: 'Time-Tables',
    icon: 'bi-clock-history',
    group: 'Academics',
    type: 'list',
    addLabel: 'Add programme',
    intro:
      'Class time-tables, one block per programme. Upload the PDF against a semester to publish it; a semester with no file is still listed, but not offered as a download.',
    summary: { title: 'name', meta: ['slug'], count: 'semesters', countLabel: 'semesters' },
    fields: [
      { name: 'name', label: 'Programme', type: 'text', full: true },
      { name: 'slug', label: 'Web address', type: 'text', hint: 'e.g. cse — used in /academic/time-table/cse' },
      iconField(),
      {
        name: 'text',
        label: 'Card description',
        type: 'textarea',
        full: true,
        hint: 'The line shown on the programme card on the time-table listing page.',
      },
      { name: 'structure', label: 'How the programme runs', type: 'textarea', full: true },
      {
        name: 'semesters',
        label: 'Semesters',
        type: 'items',
        full: true,
        addLabel: 'Add semester',
        fields: [
          { name: 'title', label: 'Semester', type: 'text', placeholder: 'Third Semester' },
          { name: 'year', label: 'Year', type: 'text', placeholder: 'Second Year' },
          { name: 'note', label: 'Note', type: 'textarea', full: true },
          { name: 'file', label: 'Time-table PDF', type: 'media', kind: 'document', full: true },
        ],
      },
    ],
  },

  periods: {
    collection: 'periods',
    title: 'Daily Periods',
    icon: 'bi-hourglass-split',
    group: 'Academics',
    type: 'list',
    addLabel: 'Add period',
    intro: 'The period-and-timing table shown on the time-table pages.',
    summary: { title: 'period', meta: ['time', 'kind'] },
    fields: [
      { name: 'period', label: 'Period', type: 'text', placeholder: 'III' },
      { name: 'time', label: 'Timing', type: 'text', placeholder: '12:00 Noon – 01:00 PM' },
      { name: 'kind', label: 'Type', type: 'select', options: ['Theory', 'Practical', 'Recess', 'Practical / Remedial'] },
      { name: 'isBreak', label: 'This is the lunch break', type: 'check' },
    ],
  },

  'timetable-notes': {
    collection: 'timetable-notes',
    title: 'Time-Table Notes',
    icon: 'bi-info-circle-fill',
    group: 'Academics',
    type: 'list',
    addLabel: 'Add note',
    intro: 'The notes printed under the time-table.',
    summary: { title: 'text' },
    fields: [{ name: 'text', label: 'Note', type: 'textarea', full: true }],
  },

  /* ----------------------------- Placements ------------------------------ */

  recruiters: {
    collection: 'recruiters',
    title: 'Recruiters',
    icon: 'bi-briefcase-fill',
    group: 'Placements',
    type: 'list',
    addLabel: 'Add recruiter',
    intro:
      'Organisations that recruit from campus, shown on the home page band and the recruiters page. A company with no logo falls back to a wordmark card.',
    summary: { title: 'name', meta: ['sector'], thumb: 'logo' },
    fields: [
      { name: 'name', label: 'Company name', type: 'text', full: true },
      { name: 'short', label: 'Short name', type: 'text', hint: 'Shown on the wordmark card.' },
      { name: 'sector', label: 'Sector', type: 'text' },
      {
        name: 'logo',
        label: 'Logo',
        type: 'media',
        kind: 'image',
        full: true,
        hint: 'A white or transparent background works best — the card sits on white.',
      },
    ],
  },
};

/** Section keys in the order the sidebar should list them. */
export const SECTION_KEYS = Object.keys(SECTIONS);

/** Sidebar groups, in order, each with its sections. */
export function sectionGroups() {
  const order = [];
  const groups = new Map();

  for (const key of SECTION_KEYS) {
    const section = SECTIONS[key];
    if (!groups.has(section.group)) {
      groups.set(section.group, []);
      order.push(section.group);
    }
    groups.get(section.group).push({ key, ...section });
  }

  return order.map((name) => ({ name, sections: groups.get(name) }));
}
