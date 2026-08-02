"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const AMENITIES = [
  {
    icon: 'bi-door-closed-fill',
    title: 'Furnished Rooms',
    text: 'Well-ventilated rooms with a cot, study table, chair and storage for each resident.',
  },
  {
    icon: 'bi-cup-hot-fill',
    title: 'Mess & Dining',
    text: 'A hygienic mess serving nutritious vegetarian meals on a fixed weekly menu.',
  },
  {
    icon: 'bi-droplet-fill',
    title: 'Water & Sanitation',
    text: 'RO drinking water, clean washrooms and regular housekeeping across all floors.',
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'Power Backup',
    text: 'Generator backup so that study hours are never disrupted by power cuts.',
  },
  {
    icon: 'bi-wifi',
    title: 'Internet Access',
    text: 'Wi-Fi connectivity in common areas for study, assignments and online resources.',
  },
  {
    icon: 'bi-journal-bookmark-fill',
    title: 'Common Study Room',
    text: 'A quiet shared space for group study, revision and examination preparation.',
  },
  {
    icon: 'bi-hospital-fill',
    title: 'Medical Support',
    text: 'First-aid facility on site and prompt referral to nearby hospitals when required.',
  },
  {
    icon: 'bi-tv-fill',
    title: 'Recreation Room',
    text: 'Television and indoor games for relaxation during free hours.',
  },
];

const SAFETY = [
  { icon: 'bi-shield-lock-fill', label: '24×7 security guard at the hostel gate' },
  { icon: 'bi-camera-video-fill', label: 'CCTV surveillance in corridors and entry points' },
  { icon: 'bi-person-badge-fill', label: 'Resident warden available on campus at all times' },
  { icon: 'bi-clipboard-check-fill', label: 'Entry and exit register maintained for every resident' },
  { icon: 'bi-telephone-fill', label: 'Emergency contact numbers displayed on every floor' },
  { icon: 'bi-fire', label: 'Fire safety equipment installed and periodically checked' },
];

const RULES = [
  'Residents must return to the hostel before the notified closing time each day.',
  'Entry and exit must be recorded in the register maintained by the warden.',
  'Leave to go home requires prior written permission and parental consent.',
  'Visitors are permitted only in the designated visitors’ area during visiting hours.',
  'Ragging in any form is strictly prohibited and attracts severe disciplinary action.',
  'Electrical appliances may be used only with the permission of the warden.',
  'Residents are responsible for the care of hostel property in their rooms.',
  'Silence hours must be observed during designated study time.',
];

const STEPS = [
  {
    title: 'Apply After Admission',
    text: 'Submit the hostel application form to the institute office once your admission is confirmed.',
  },
  {
    title: 'Attach Required Documents',
    text: 'Enclose your admission letter, identity proof, parental consent letter and medical fitness certificate.',
  },
  {
    title: 'Allotment of Room',
    text: 'Rooms are allotted by the warden, with priority given to students residing farthest from the institute.',
  },
  {
    title: 'Deposit the Hostel Fee',
    text: 'Pay the hostel and mess charges as prescribed under government norms and collect the receipt.',
  },
  {
    title: 'Report to the Warden',
    text: 'Complete the joining formalities, sign the undertaking of hostel rules and take charge of your room.',
  },
];

export default function HostelsPage() {
  return (
    <>
      <PageHeader
        icon="bi-house-heart-fill"
        eyebrow="Life @ KMGGP"
        title="Hostels"
        subtitle="A safe, disciplined and supportive residence for students living away from home."
        crumbs={[{ label: 'Life@KMGGP', href: '/life' }, { label: 'Hostels' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="A Home on Campus"
                icon="bi-house-heart-fill"
                title="Living on Campus"
              />
              <p className="lead">
                The on-campus girls hostel offers a secure and conducive environment for learning,
                allowing students from distant districts to pursue their diploma without concern for
                daily travel.
              </p>
              <p>
                Life in the hostel is structured but warm. Fixed study hours, a resident warden and
                round-the-clock security give parents peace of mind, while shared rooms, common
                spaces and festival celebrations build lasting friendships among residents.
              </p>

              <div className="callout mt-4">
                <i className="bi bi-shield-check" />
                <p>
                  <strong>Anti-ragging assurance:</strong> ragging in any form is strictly prohibited
                  in the hostel and on campus. Any incident is dealt with immediately under the
                  applicable regulations.
                </p>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-shield-lock-fill" />
                  Safety &amp; Security
                </div>
                <div className="panel-body">
                  {SAFETY.map((item) => (
                    <div className="feature-row align-items-center mb-3" key={item.label}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${item.icon}`} />
                      </span>
                      <h5 className="mb-0">{item.label}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="Facilities"
            icon="bi-buildings-fill"
            title="Hostel Amenities"
          />
          <Row className="g-4">
            {AMENITIES.map((amenity) => (
              <Col lg={3} md={6} key={amenity.title}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile mb-3">
                    <i className={`bi ${amenity.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-2">{amenity.title}</h5>
                  <p className="small mb-0">{amenity.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-list-ol" />
                  How to Apply for Hostel Accommodation
                </div>
                <div className="panel-body">
                  <ul className="timeline">
                    {STEPS.map((step) => (
                      <li key={step.title}>
                        <h6>{step.title}</h6>
                        <p>{step.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-clipboard-check-fill" />
                  Hostel Rules
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {RULES.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-person-badge-fill side-cta-icon" />
                <h6>Hostel Enquiries</h6>
                <p>Contact the institute office or the hostel warden for allotment and fee details.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Office
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              Hostel accommodation is subject to availability of seats. Hostel and mess charges are
              levied as per Government of Uttar Pradesh norms and are notified at the time of
              admission.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
