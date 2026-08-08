"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { JEECUP_PORTAL } from '@/lib/counselling';

/**
 * The groupwise table follows the JEECUP group codes. Only Group A is offered at
 * this institute — the rest are listed so a candidate can see where their group
 * leads before filling choices.
 */
const GROUPS = [
  {
    code: 'A',
    course: 'Engineering & Technology Diploma (3 years)',
    qualification: 'Class 10 passed with Science and Mathematics',
    marks: 'Minimum 35% aggregate',
    duration: '3 Years',
    offered: true,
  },
  {
    code: 'B',
    course: 'Agriculture Engineering Diploma',
    qualification: 'Class 10 passed with Agriculture as a subject',
    marks: 'Minimum 35% aggregate',
    duration: '3 Years',
    offered: false,
  },
  {
    code: 'C',
    course: 'Fashion Design, Home Science & Textile Design',
    qualification: 'Class 10 passed',
    marks: 'Minimum 35% aggregate',
    duration: '2–3 Years',
    offered: false,
  },
  {
    code: 'D',
    course: 'Modern Office Management & Secretarial Practice',
    qualification: 'Class 12 passed with Hindi and English',
    marks: 'Minimum 35% aggregate',
    duration: '2 Years',
    offered: false,
  },
  {
    code: 'E',
    course: 'Diploma in Pharmacy',
    qualification: 'Class 12 passed with Physics, Chemistry and Biology or Mathematics',
    marks: 'Minimum 35% aggregate',
    duration: '2 Years',
    offered: false,
  },
  {
    code: 'F',
    course: 'Post Graduate Diploma in Biotechnology',
    qualification: 'Bachelor of Science degree',
    marks: 'As per JEECUP norms',
    duration: '3 Years',
    offered: false,
  },
  {
    code: 'G',
    course: 'Post Graduate Diploma courses',
    qualification: 'Graduation in any stream',
    marks: 'As per JEECUP norms',
    duration: '1–2 Years',
    offered: false,
  },
  {
    code: 'H',
    course: 'Diploma in Hotel Management & Catering Technology',
    qualification: 'Class 12 passed',
    marks: 'Minimum 35% aggregate',
    duration: '3 Years',
    offered: false,
  },
  {
    code: 'I',
    course: 'Diploma in Aircraft Maintenance Engineering',
    qualification: 'Class 12 with Physics, Chemistry and Mathematics',
    marks: 'Minimum 35% aggregate',
    duration: '3 Years',
    offered: false,
  },
  {
    code: 'K',
    course: 'Lateral Entry — direct admission to the second year of an Engineering & Technology diploma',
    qualification: 'Class 12 with Science / Maths, or a two-year ITI after Class 10',
    marks: 'Minimum 35% aggregate',
    duration: '2 Years',
    offered: true,
  },
  {
    code: 'L',
    course: 'Diploma in Information Technology (post Class 12)',
    qualification: 'Class 12 passed in any stream',
    marks: 'Minimum 35% aggregate',
    duration: '2 Years',
    offered: false,
  },
];

const BRANCHES = [
  { branch: 'Electronics Engineering', slug: 'electronics', icon: 'bi-cpu-fill' },
  { branch: 'Computer Science & Engineering', slug: 'cse', icon: 'bi-pc-display' },
  { branch: 'Information Technology', slug: 'it', icon: 'bi-hdd-network-fill' },
];

/**
 * Both entry routes lead to the same three branches — Group A from Class 10 into
 * the first year, Group K from Class 12 or ITI straight into the second.
 */
const ENTRY_ROUTES = [
  {
    code: 'A',
    label: 'Group A — First Year Entry',
    icon: 'bi-mortarboard-fill',
    duration: '3 Years (6 Semesters)',
    entry: 'Class 10 passed with Science and Mathematics',
    note: 'The regular route. Candidates join the first semester and complete all six semesters.',
  },
  {
    code: 'K',
    label: 'Group K — Lateral Entry',
    icon: 'bi-box-arrow-in-right',
    duration: '2 Years (4 Semesters)',
    entry: 'Class 12 with Science / Maths, or a two-year ITI in a trade related to the branch',
    note: 'Candidates join directly in the third semester against supernumerary seats, as per AICTE norms.',
  },
];

const LATERAL_ELIGIBILITY = [
  'Passed Class 12 (Intermediate) with Science and Mathematics from a recognised board, with a minimum of 35% marks.',
  'Or passed Class 12 with a vocational or technical subject relevant to the branch applied for.',
  'Or passed a two-year ITI course, after Class 10, in a trade related to the branch applied for.',
  'Qualified in the JEECUP entrance examination under Group K for the current session.',
  'Admission is open to female candidates only, as this is a Government Girls Polytechnic.',
];

const LATERAL_NOTES = [
  'Lateral entry candidates are admitted directly to the third semester (second year) of the diploma.',
  'Seats are supernumerary — over and above the sanctioned first-year intake, as permitted by AICTE.',
  'The branch allotted depends on your Group K rank, choice order and seat availability during counselling.',
  'The course, examination and certification are identical to those of first-year entrants from the third semester onwards.',
  'An ITI candidate must produce the trade certificate along with the Class 10 marksheet at verification.',
];

const COMMON = [
  'The candidate must be a citizen of India.',
  'A domicile certificate of Uttar Pradesh is required to claim state quota and reservation benefits.',
  'Reservation is applied as per the rules of the Government of Uttar Pradesh.',
  'Candidates appearing in the qualifying examination may apply, subject to passing before verification.',
  'This institute admits women candidates only, across every branch offered.',
];

export default function GroupwiseEligibility() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-table" />
          Groupwise Eligibility Table
        </div>
        <div className="panel-body">
          <p className="lead">
            JEECUP conducts the entrance examination in groups, each with its own qualification
            requirement. Choose the group that matches your qualification before you register.
          </p>

          <div className="gold-rule-thin my-4" />

          <div className="table-wrap">
            <table className="premium-table eligibility-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Course</th>
                  <th>Minimum Qualification</th>
                  <th>Marks</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {GROUPS.map((group) => (
                  <tr key={group.code}>
                    <td>
                      <i className="bi bi-bookmark-fill text-gold me-2" />
                      <strong>{group.code}</strong>
                    </td>
                    <td>
                      {group.course}
                      {group.offered && (
                        <span className="badge-offered">Offered Here</span>
                      )}
                    </td>
                    <td className="small">{group.qualification}</td>
                    <td className="small">{group.marks}</td>
                    <td className="small">{group.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-box-arrow-in-right" />
          Two Ways In — Group A and Group K Lateral Entry
        </div>
        <div className="panel-body">
          <p>
            This institute admits under <strong>Group A</strong> and <strong>Group K</strong>. Both
            routes lead to the same three diploma branches — the difference is the qualification you
            enter with and the semester you join.
          </p>

          <Row className="g-4 mt-1">
            {ENTRY_ROUTES.map((route) => (
              <Col md={6} key={route.code}>
                <div className="premium-card h-100 p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="icon-tile icon-tile-sm">
                      <i className={`bi ${route.icon}`} />
                    </span>
                    <h6 className="fw-bold mb-0">{route.label}</h6>
                  </div>
                  <div className="gold-rule-thin mb-3" />
                  <p className="small mb-2">
                    <i className="bi bi-hourglass-split text-gold me-2" />
                    <strong>Duration:</strong> {route.duration}
                  </p>
                  <p className="small mb-2">
                    <i className="bi bi-patch-check-fill text-gold me-2" />
                    <strong>Entry qualification:</strong> {route.entry}
                  </p>
                  <p className="small mb-0">{route.note}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <Row className="g-4 mt-0">
        <Col lg={7}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-mortarboard-fill" />
              Branches Offered at KMGGP, Badalpur
            </div>
            <div className="panel-body">
              <p className="small">
                Each branch below admits under <strong>both</strong> Group A and Group K. Fill your
                choices under the group you qualified in.
              </p>

              {BRANCHES.map((item) => (
                <Link
                  href={`/department/${item.slug}`}
                  className="doc-link"
                  key={item.slug}
                >
                  <i className={`bi ${item.icon}`} />
                  <span className="flex-grow-1">
                    {item.branch}
                    <span className="badge-group">Group A</span>
                    <span className="badge-group">Group K</span>
                  </span>
                  <i className="bi bi-arrow-right-short" />
                </Link>
              ))}
            </div>
          </div>
        </Col>

        <Col lg={5}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-check2-square" />
              Common Conditions
            </div>
            <div className="panel-body">
              <ul className="gold-list">
                {COMMON.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>

              <div className="callout mt-4">
                <i className="bi bi-info-circle-fill" />
                <p>
                  Group codes and eligibility conditions are revised by JEECUP from time to time.
                  Confirm them in the current-year brochure on the{' '}
                  <a href={JEECUP_PORTAL} target="_blank" rel="noopener noreferrer">
                    official portal
                  </a>{' '}
                  before applying.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-box-arrow-in-right" />
          Group K Lateral Entry — Eligibility in Detail
        </div>
        <div className="panel-body">
          <p className="lead">
            Lateral entry lets a Class 12 or ITI qualified candidate skip the first year and join
            the diploma directly in the third semester, finishing in two years instead of three.
          </p>

          <div className="gold-rule-thin my-4" />

          <Row className="g-4">
            <Col lg={6}>
              <h5 className="fw-bold mb-3">
                <i className="bi bi-patch-check-fill text-gold me-2" />
                Who Can Apply
              </h5>
              <ul className="gold-list">
                {LATERAL_ELIGIBILITY.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Col>

            <Col lg={6}>
              <h5 className="fw-bold mb-3">
                <i className="bi bi-info-square-fill text-gold me-2" />
                What to Know Before Applying
              </h5>
              <ul className="gold-list">
                {LATERAL_NOTES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Col>
          </Row>

          <div className="callout mt-4">
            <i className="bi bi-exclamation-triangle-fill" />
            <p>
              A candidate must appear in the Group K paper to be considered for lateral entry.
              Qualifying in Group A does not make you eligible for second-year admission.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
