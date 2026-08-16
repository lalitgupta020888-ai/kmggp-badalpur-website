/**
 * The prose pages — About, Vision & Mission and the Principal's Message.
 *
 * The wording on these was written into the page components, which meant a
 * change of Principal or a rewritten paragraph needed a code change. Bodies are
 * kept as one string with blank lines between paragraphs, so the panel can offer
 * a single text box rather than a repeater of one-line rows.
 */

export const ABOUT_PAGE = {
  eyebrow: 'Our Story',
  title: 'Education That Opens Doors',
  lead:
    'Km. Mayawati Government Girls Polytechnic, Badalpur, Gautam Buddha Nagar is a premier technical institution established in 2002 by the Government of Uttar Pradesh to promote technical education among women. Spread over 7.3 acres, its diploma programmes are approved by AICTE, New Delhi and affiliated to BTEUP, Lucknow.',
  body: [
    'Our goal is to foster an environment of academic excellence, innovation and holistic development. The institute offers diploma courses across several engineering disciplines, supported by state-of-the-art infrastructure and highly experienced faculty who mentor every student individually.',
    'Beyond the classroom, students take part in technical clubs, cultural festivals, sports and community initiatives — building the confidence and character that employers value as highly as technical skill.',
  ].join('\n\n'),
  callout:
    'Our vision is to empower young women with technical skills, leadership qualities and ethical values, enabling them to excel in a competitive global landscape.',
  values: [
    {
      id: 'excellence',
      icon: 'bi-lightbulb-fill',
      title: 'Academic Excellence',
      text: 'A rigorous, industry-aligned curriculum delivered by experienced and dedicated faculty.',
    },
    {
      id: 'empowerment',
      icon: 'bi-gender-female',
      title: 'Women Empowerment',
      text: 'A campus built exclusively for young women to learn, lead and thrive with confidence.',
    },
    {
      id: 'practical',
      icon: 'bi-tools',
      title: 'Practical Learning',
      text: 'Laboratory-led teaching that turns theory into demonstrable, employable skill.',
    },
    {
      id: 'ethics',
      icon: 'bi-heart-fill',
      title: 'Ethics & Values',
      text: 'Integrity, discipline and social responsibility woven through campus life.',
    },
  ],
  milestones: [
    {
      id: 'founded',
      title: 'Established in 2002 by the Government of Uttar Pradesh',
      text: 'Founded to widen access to technical education for women across Gautam Buddha Nagar and beyond.',
    },
    {
      id: 'campus',
      title: 'A 7.3-Acre Campus at Badalpur',
      text: 'Academic blocks, laboratories, the library, hostel and playgrounds spread across 7.3 acres of green campus.',
    },
    {
      id: 'aicte',
      title: 'Approved by AICTE',
      text: 'All diploma programmes run under the approval of the All India Council for Technical Education, New Delhi.',
    },
    {
      id: 'bteup',
      title: 'Affiliated to BTEUP',
      text: 'All diploma programmes follow the curriculum prescribed by the Board of Technical Education, Uttar Pradesh.',
    },
    {
      id: 'disciplines',
      title: 'Four Disciplines Offered',
      text: 'Diplomas in Electronics, Computer Science and Information Technology with 75 seats each, and a PG diploma in Retail Management with 37 seats.',
    },
    {
      id: 'placements',
      title: 'A Growing Placement Network',
      text: 'Strong ties with leading recruiters supported by a dedicated Training & Placement cell.',
    },
  ],
};

export const VISION_PAGE = {
  vision:
    'To be recognised as a centre of excellence in technical education for women — producing skilled, confident and ethical professionals who lead in industry and society.',
  mission: [
    'Provide a rigorous academic environment that fosters innovation, enquiry and continuous learning.',
    'Deliver laboratory-led instruction so every student converts theory into demonstrable skill.',
    'Build lasting industry collaborations for practical exposure and stronger placement outcomes.',
    'Create a safe, inclusive campus where each student can realise her full potential.',
    'Instil ethical values, discipline and a sense of responsibility towards society.',
    'Encourage entrepreneurship and higher studies alongside conventional career pathways.',
  ].map((text, index) => ({ id: `mission-${index + 1}`, text })),
  objectives: [
    {
      id: 'quality',
      icon: 'bi-mortarboard-fill',
      title: 'Academic Quality',
      text: 'Maintain a consistently high pass percentage and produce top rank holders in BTEUP examinations.',
    },
    {
      id: 'employability',
      icon: 'bi-briefcase-fill',
      title: 'Employability',
      text: 'Equip every eligible student with the technical and soft skills required to secure meaningful employment.',
    },
    {
      id: 'innovation',
      icon: 'bi-lightbulb-fill',
      title: 'Innovation',
      text: 'Encourage student projects, technical competitions and exposure to emerging technologies.',
    },
    {
      id: 'women',
      icon: 'bi-gender-female',
      title: 'Women Empowerment',
      text: 'Build confidence, leadership and financial independence among young women through technical education.',
    },
  ],
  values: [
    { id: 'integrity', icon: 'bi-shield-check', label: 'Integrity' },
    { id: 'inclusivity', icon: 'bi-people-fill', label: 'Inclusivity' },
    { id: 'excellence', icon: 'bi-stars', label: 'Excellence' },
    { id: 'discipline', icon: 'bi-hand-thumbs-up-fill', label: 'Discipline' },
    { id: 'innovation', icon: 'bi-lightbulb-fill', label: 'Innovation' },
    { id: 'empathy', icon: 'bi-heart-fill', label: 'Empathy' },
  ],
};

export const PRINCIPAL_PAGE = {
  quote:
    'Education is the most powerful instrument a young woman can hold. Our purpose here is to place that instrument firmly in her hands.',
  body: [
    'It gives me great pleasure to welcome you to Km. Mayawati Government Girls Polytechnic, Badalpur. Established in 2002 by the Government of Uttar Pradesh, this institute exists for a clear and important reason — to make quality technical education accessible to young women, and to help them build careers of independence and dignity.',
    'Over the years we have grown into a campus with modern laboratories, a rich library and a committed faculty who know their students by name. Our diploma programmes in Electronics Engineering, Computer Science & Engineering and Information Technology follow the BTEUP curriculum, but our teaching goes further — we insist that every concept taught in the classroom is proved on a workbench.',
    'Equally important is what happens beyond academics. Through clubs, cultural festivals, sports and community outreach, our students learn to speak with confidence, work in teams and lead. Employers tell us these qualities matter as much as technical knowledge, and our placement record reflects that.',
    'To parents, I offer this assurance: your daughter will study in a safe, disciplined and supportive environment where her progress is watched closely and her wellbeing is taken seriously.',
    'To our students — be curious, be diligent, and never underestimate what you are capable of achieving. The institute and its faculty stand with you at every step of your journey.',
  ].join('\n\n'),
  signatureName: 'Principal',
  signatureRole: 'Km. Mayawati Government Girls Polytechnic, Badalpur',
  email: 'principal@kmggp.ac.in',
  phone: '+91 XXXXX XXXXX',
  priorities: [
    {
      id: 'rigour',
      icon: 'bi-mortarboard-fill',
      title: 'Academic Rigour',
      text: 'Disciplined teaching, regular assessment and individual attention for every student.',
    },
    {
      id: 'skill',
      icon: 'bi-tools',
      title: 'Practical Skill',
      text: 'Laboratory work and live projects that make classroom concepts tangible.',
    },
    {
      id: 'career',
      icon: 'bi-briefcase-fill',
      title: 'Career Readiness',
      text: 'Training, mentoring and placement support from the first semester onward.',
    },
    {
      id: 'safety',
      icon: 'bi-shield-lock-fill',
      title: 'A Safe Campus',
      text: 'A secure, respectful environment where students can focus entirely on learning.',
    },
  ],
};

/** Split a stored body into paragraphs for rendering. */
export function paragraphs(body) {
  return String(body || '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}
