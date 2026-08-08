/**
 * Single source of truth for the Employee Section.
 *
 * The section sidebar and its landing page both read EMPLOYEE_LINKS, so the two
 * never drift apart — same arrangement as the counselling desk.
 */
export const EMPLOYEE_LINKS = [
  {
    href: '/employee/pay-calculator',
    label: 'Pay Calculator',
    icon: 'bi-calculator-fill',
    blurb: 'Work out gross and net monthly pay from basic pay, allowances and deductions.',
  },
  {
    href: '/employee/it-calculator',
    label: 'IT Calculator',
    icon: 'bi-percent',
    blurb: 'Compare income tax under the new and old regimes and see the slab-wise break-up.',
  },
];
