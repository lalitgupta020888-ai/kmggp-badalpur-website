"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

/**
 * Dignitaries grid — three cards on the first row, two centred beneath.
 *
 * To add a portrait, drop the file into `public/images/leadership/` and set
 * `photo` to its path below. Entries without a photo fall back to a gold
 * monogram, so the grid stays presentable either way.
 */
const LEADERS = [
  {
    name: 'Shri Yogi Adityanath',
    role: "Hon'ble Chief Minister",
    org: 'Government of Uttar Pradesh',
    photo: '/images/leadership/yogi-adityanath.webp',
  },
  {
    name: 'Shri Ashish Patel',
    role: "Hon'ble Minister",
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/ashish-patel.png',
  },
  {
    name: 'Dr. M. K. Shanmuga Sundaram (IAS)',
    role: 'Principal Secretary',
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/shanmuga-sundaram.png',
  },
  {
    name: 'Smt. Selva Kumari J. (IAS)',
    role: 'Director General',
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/selva-kumari.png',
  },
  {
    name: 'Shri Prabhakar Chandra Mishra',
    role: 'Director',
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/prabhakar-mishra.png',
  },
];

/** First letters of the first two meaningful words, e.g. "Yogi Adityanath" → YA */
function monogram(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .split(' ')
    .filter((w) => !['Shri', 'Smt.', 'Dr.', 'Km.', 'Mrs.', 'Ms.'].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Leadership() {
  return (
    <section className="section-sm" style={{ background: 'var(--paper)' }}>
      <Container>
        {/* All five sit on one line from lg up; below that they wrap and stay centred */}
        <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 justify-content-center">
          {LEADERS.map((leader) => (
            <Col key={leader.name}>
              <article className="leader-tile h-100">
                <div className="leader-frame">
                  {leader.photo ? (
                    <Image
                      src={leader.photo}
                      alt={leader.name}
                      fill
                      sizes="150px"
                      style={{ objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  ) : (
                    <span className="leader-monogram">{monogram(leader.name)}</span>
                  )}
                </div>

                <h5 className="leader-tile-name">{leader.name}</h5>
                <div className="gold-flourish leader-tile-rule">
                  <i className="bi bi-diamond-fill" />
                </div>
                <p className="leader-tile-role">
                  <span>{leader.role}</span>
                </p>
                <p className="leader-tile-org">{leader.org}</p>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
