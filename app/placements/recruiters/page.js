import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { getSection } from '@/lib/server/sections';

const SECTORS = [
  { icon: 'bi-code-slash', title: 'IT & Software Services', text: 'Development, testing, technical support and IT operations roles.' },
  { icon: 'bi-cpu-fill', title: 'Electronics & Manufacturing', text: 'Production, quality assurance and maintenance engineering.' },
  { icon: 'bi-hdd-network-fill', title: 'Networking & Infrastructure', text: 'Network administration, data centre and field support roles.' },
  { icon: 'bi-headset', title: 'Business Process Services', text: 'Technical helpdesk, process associate and analyst positions.' },
];

export default async function Recruiters() {
  const RECRUITERS = await getSection('recruiters');

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-buildings" />
          Our Recruiters
        </div>
        <div className="panel-body">
          <p>
            We are proud to maintain strong ties with leading organisations that consistently recruit
            our talented students across engineering and technology roles.
          </p>

          <div className="gold-rule-thin my-4" />

          <div className="chip-grid">
            {RECRUITERS.map((company) => (
              <span className="brand-chip" key={company.name}>
                <i className="bi bi-building-fill" />
                {company.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-diagram-3-fill" />
          Sectors Our Students Join
        </div>
        <div className="panel-body">
          <Row className="g-4">
            {SECTORS.map((sector) => (
              <Col md={6} key={sector.title}>
                <div className="feature-row h-100">
                  <span className="icon-tile icon-tile-sm">
                    <i className={`bi ${sector.icon}`} />
                  </span>
                  <div>
                    <h5>{sector.title}</h5>
                    <p>{sector.text}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="callout mt-4">
        <i className="bi bi-building-check" />
        <p>
          Organisations wishing to conduct a campus recruitment drive may write to the Training &amp;
          Placement cell at <strong>tnp@kmggp.ac.in</strong> to schedule a visit.
        </p>
      </div>
    </>
  );
}
