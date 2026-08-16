"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import SectionHead from '@/components/SectionHead';
import { monogram } from '@/lib/leadership';

/**
 * Dignitaries grid, under the standard gold section heading — five cards on
 * one line from lg up, wrapping and staying centred below that.
 *
 * The people and the heading both come from the admin panel, so a change of
 * post is a panel edit rather than a code change. A leader without a photograph
 * falls back to a gold monogram, which keeps the grid presentable while a
 * portrait is being arranged.
 */
export default function Leadership({ leaders = [], heading = {} }) {
  if (leaders.length === 0) return null;

  return (
    <section className="section" style={{ background: 'var(--paper)' }}>
      <Container>
        <SectionHead
          eyebrow={heading.eyebrow}
          icon="bi-award-fill"
          title={heading.title}
          subtitle={heading.subtitle}
        />

        {/* All five sit on one line from lg up; below that they wrap and stay centred */}
        <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 justify-content-center">
          {leaders.map((leader) => (
            <Col key={leader.id || leader.name}>
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
