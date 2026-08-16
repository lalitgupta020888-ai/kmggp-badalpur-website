import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getSection } from '@/lib/server/sections';



export default async function InformationBooklet() {
  const booklet = await getSection('booklet');
  const JEECUP_BOOKLET_FILE = booklet.file;
  const CONTENTS = (booklet.contents || []).map((item) => item.text);
  const DOWNLOADS = booklet.downloads || [];

  return (
    <>
      <PageHeader
        icon="bi-file-earmark-pdf"
        eyebrow="Admissions"
        title="Information Booklet 2026-27"
        subtitle="The complete official handbook covering courses, admission, fees and campus facilities."
        crumbs={[{ label: 'Admissions' }, { label: 'Information Booklet' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-journal-richtext" />
                  What the Booklet Contains
                </div>
                <div className="panel-body">
                  <p>
                    The information booklet for the academic session 2026-27 brings together everything
                    a prospective student and her family need to know about Km. Mayawati Government
                    Girls Polytechnic, Badalpur.
                  </p>
                  <ul className="gold-list mt-4">
                    {CONTENTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-download" />
                  Download Centre
                </div>
                <div className="panel-body">
                  {DOWNLOADS.map((item) =>
                    item.file ? (
                      <a
                        href={item.file}
                        className="doc-link"
                        key={item.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className={`bi ${item.icon}`} />
                        <span className="flex-grow-1">{item.label}</span>
                        <i className="bi bi-download doc-link-external" />
                      </a>
                    ) : (
                      <span className="doc-link is-pending" key={item.label}>
                        <i className={`bi ${item.icon}`} />
                        <span className="flex-grow-1">{item.label}</span>
                        <span className="doc-link-soon">Awaited</span>
                      </span>
                    )
                  )}

                  <div className="callout mt-4">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      Documents will be published here as soon as they are released by the institute
                      administration for the 2026-27 session.
                    </p>
                  </div>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-envelope-paper-fill side-cta-icon" />
                <h6>Prefer a Printed Copy?</h6>
                <p>Printed booklets are available at the institute admission counter during office hours.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Office
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
