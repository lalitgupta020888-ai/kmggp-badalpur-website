"use client";

import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';

/**
 * Monthly pay calculator.
 *
 * DA and the NPS share are percentages of pay and are revised by government
 * order more often than this page would be updated, so the calculator asks for
 * the rate instead of asserting it. HRA is drawn as a fixed monthly amount, so
 * it is entered in rupees.
 */
/** Treasury portal where the actual month-wise drawn statement is published. */
const KOSHVANI_DRAWN_STATEMENT = 'https://koshvani.up.nic.in/KoshReports/EmpSalDetail.aspx';

const DEFAULTS = {
  basic: '',
  da: '55',
  hra: '0',
  otherAllowance: '0',
  npsRate: '10',
  incomeTax: '0',
  insurance: '0',
  otherDeduction: '0',
};

const num = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const rupees = (value) =>
  value.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 });

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen',
];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const underHundred = (n) =>
  n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`;

const underThousand = (n) =>
  n < 100
    ? underHundred(n)
    : `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${underHundred(n % 100)}` : ''}`;

/** Amount in words, Indian grouping — a pay slip is expected to carry it. */
function inWords(value) {
  const amount = Math.round(value);
  if (amount <= 0) return 'Zero';

  const parts = [];
  const groups = [
    { size: 10000000, name: 'Crore' },
    { size: 100000, name: 'Lakh' },
    { size: 1000, name: 'Thousand' },
  ];

  let remainder = amount;
  for (const group of groups) {
    const count = Math.floor(remainder / group.size);
    if (count) parts.push(`${underThousand(count)} ${group.name}`);
    remainder %= group.size;
  }
  if (remainder) parts.push(underThousand(remainder));

  return parts.join(' ');
}

/** Identity fields — they take no part in the arithmetic, but a pay slip
 *  without a name and a month is not a pay slip. */
const SLIP_DEFAULTS = { name: '', designation: '', month: '' };

export default function PayCalculator() {
  const [form, setForm] = useState(DEFAULTS);
  const [slip, setSlip] = useState(SLIP_DEFAULTS);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const updateSlip = (field) => (event) => setSlip({ ...slip, [field]: event.target.value });

  const reset = () => {
    setForm(DEFAULTS);
    setSlip(SLIP_DEFAULTS);
  };

  const basic = num(form.basic);
  const da = Math.round((basic * num(form.da)) / 100);
  const hra = num(form.hra);
  const otherAllowance = num(form.otherAllowance);

  // NPS is levied on basic + DA, the standard base for the employee share.
  const nps = Math.round(((basic + da) * num(form.npsRate)) / 100);
  const incomeTax = num(form.incomeTax);
  const insurance = num(form.insurance);
  const otherDeduction = num(form.otherDeduction);

  const gross = basic + da + hra + otherAllowance;
  const deductions = nps + incomeTax + insurance + otherDeduction;
  const net = gross - deductions;

  const EARNINGS = [
    { label: 'Basic Pay', value: basic, note: 'As per your pay level and cell' },
    { label: 'Dearness Allowance', value: da, note: `${num(form.da)}% of basic pay` },
    { label: 'House Rent Allowance', value: hra, note: 'Fixed monthly amount drawn' },
    { label: 'Other Allowances', value: otherAllowance, note: 'Any additional allowance drawn' },
  ];

  const DEDUCTIONS = [
    { label: 'NPS — Employee Share', value: nps, note: `${num(form.npsRate)}% of basic pay + DA` },
    { label: 'Income Tax (TDS)', value: incomeTax, note: 'Monthly tax deducted at source' },
    { label: 'Insurance / GIS', value: insurance, note: 'Group insurance premium' },
    { label: 'Other Deductions', value: otherDeduction, note: 'Loan, licence fee, recovery' },
  ];

  /** Earnings and deductions set side by side, the way a slip is read. */
  const SLIP_ROWS = Array.from(
    { length: Math.max(EARNINGS.length, DEDUCTIONS.length) },
    (unused, index) => ({ earning: EARNINGS[index], deduction: DEDUCTIONS[index] })
  );

  return (
    <>
      {/* The printed artefact — one table carrying the whole slip. It exists
          only on paper; on screen the calculator's own panels do the job. */}
      <div className="pay-slip print-only">
        <div className="slip-masthead">
          <h2>Km. Mayawati Government Girls Polytechnic, Badalpur</h2>
          <p>Gautam Buddha Nagar, Uttar Pradesh</p>
          <span className="slip-title">Pay Slip</span>
        </div>

        <table className="slip-table">
          <tbody>
            <tr className="slip-identity">
              <th>Employee Name</th>
              <td colSpan={2}>{slip.name || '—'}</td>
              <th>Month</th>
              <td>{slip.month || '—'}</td>
            </tr>
            <tr className="slip-identity">
              <th>Designation</th>
              <td colSpan={2}>{slip.designation || '—'}</td>
              <th>Institute</th>
              <td>KMGGP, Badalpur</td>
            </tr>

            <tr className="slip-head">
              <th colSpan={2}>Earnings</th>
              <th colSpan={3}>Deductions</th>
            </tr>

            {SLIP_ROWS.map((row, index) => (
              <tr key={index}>
                <td>{row.earning ? row.earning.label : ''}</td>
                <td className="slip-amount">
                  {row.earning ? rupees(row.earning.value) : ''}
                </td>
                <td colSpan={2}>{row.deduction ? row.deduction.label : ''}</td>
                <td className="slip-amount">
                  {row.deduction ? rupees(row.deduction.value) : ''}
                </td>
              </tr>
            ))}

            <tr className="slip-subtotal">
              <th>Gross Pay</th>
              <td className="slip-amount">{rupees(gross)}</td>
              <th colSpan={2}>Total Deductions</th>
              <td className="slip-amount">{rupees(deductions)}</td>
            </tr>

            <tr className="slip-net">
              <th colSpan={4}>Net Pay</th>
              <td className="slip-amount">₹ {rupees(net)}</td>
            </tr>

            <tr className="slip-words">
              <th>In Words</th>
              <td colSpan={4}>Rupees {inWords(net)} Only</td>
            </tr>
          </tbody>
        </table>

        <div className="slip-signatures">
          <span>Signature of Employee</span>
          <span>Drawing &amp; Disbursing Officer</span>
        </div>

        <p className="slip-foot">
          Computed from the figures entered by the employee. This slip is for reference only and is
          not an authenticated statement issued by the institute.
        </p>
      </div>

      <div className="panel no-print">
        <div className="panel-header">
          <i className="bi bi-calculator-fill" />
          Pay Calculator
        </div>
        <div className="panel-body">
          <p className="lead">
            Enter your basic pay and the rates currently in force. Gross pay, deductions and net pay
            are worked out as you type — nothing is stored or sent anywhere.
          </p>

          <div className="gold-rule-thin my-4" />

          <Form className="premium-form">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-person-vcard text-gold me-2" />
              Pay Slip Details
            </h6>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={slip.name}
                  onChange={updateSlip('name')}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Lecturer"
                  value={slip.designation}
                  onChange={updateSlip('designation')}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Month &amp; Year</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. April 2026"
                  value={slip.month}
                  onChange={updateSlip('month')}
                />
              </Col>
            </Row>
            <p className="small mb-0 mt-2">
              These appear on the printed pay slip only — they take no part in the calculation.
            </p>

            <div className="gold-rule-thin my-4" />
            <h6 className="fw-bold mb-3">
              <i className="bi bi-cash-stack text-gold me-2" />
              Earnings
            </h6>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>Basic Pay (₹)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 44900"
                  value={form.basic}
                  onChange={update('basic')}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Dearness Allowance (%)</Form.Label>
                <Form.Control type="number" min="0" value={form.da} onChange={update('da')} />
              </Col>
              <Col md={4}>
                <Form.Label>House Rent Allowance (₹)</Form.Label>
                <Form.Control type="number" min="0" value={form.hra} onChange={update('hra')} />
              </Col>
              <Col md={4}>
                <Form.Label>Other Allowances (₹)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={form.otherAllowance}
                  onChange={update('otherAllowance')}
                />
              </Col>
            </Row>

            <div className="gold-rule-thin my-4" />

            <h6 className="fw-bold mb-3">
              <i className="bi bi-dash-circle text-gold me-2" />
              Deductions
            </h6>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>NPS Share (%)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={form.npsRate}
                  onChange={update('npsRate')}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Income Tax (₹)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={form.incomeTax}
                  onChange={update('incomeTax')}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Insurance / GIS (₹)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={form.insurance}
                  onChange={update('insurance')}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Other Deductions (₹)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={form.otherDeduction}
                  onChange={update('otherDeduction')}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <Row className="g-4 mt-0 no-print">
        <Col md={4}>
          <div className="calc-tile h-100">
            <span className="calc-tile-label">Gross Pay</span>
            <span className="calc-tile-value">₹ {rupees(gross)}</span>
            <span className="calc-tile-note">Per month</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="calc-tile h-100">
            <span className="calc-tile-label">Total Deductions</span>
            <span className="calc-tile-value">₹ {rupees(deductions)}</span>
            <span className="calc-tile-note">Per month</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="calc-tile calc-tile-primary h-100">
            <span className="calc-tile-label">Net Pay</span>
            <span className="calc-tile-value">₹ {rupees(net)}</span>
            <span className="calc-tile-note">Take-home, per month</span>
          </div>
        </Col>
      </Row>

      {/* Sits directly under the result tiles — the moment the figures are on
          screen is the moment a slip is wanted, and it is above the fold on the
          way down to the break-up tables. */}
      <div className="calc-actions no-print">
        <div>
          <h6 className="fw-bold mb-1">Take a printed copy</h6>
          <p className="small mb-0">
            The slip carries the earnings and deductions break-up below, under the institute
            masthead.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Button className="btn-gold" onClick={() => window.print()}>
            <i className="bi bi-printer-fill" />
            Pay Slip
          </Button>
          <Button className="btn-outline-navy" onClick={reset}>
            <i className="bi bi-arrow-counterclockwise" />
            Reset
          </Button>
        </div>
      </div>

      <Row className="g-4 mt-0 no-print">
        <Col lg={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-plus-circle" />
              Earnings Break-up
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table calc-table">
                  <thead>
                    <tr>
                      <th>Head</th>
                      <th>Basis</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EARNINGS.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td className="small">{row.note}</td>
                        <td className="calc-amount">₹ {rupees(row.value)}</td>
                      </tr>
                    ))}
                    <tr className="is-total">
                      <td colSpan={2}>Gross Pay</td>
                      <td className="calc-amount">₹ {rupees(gross)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-dash-circle" />
              Deductions Break-up
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table calc-table">
                  <thead>
                    <tr>
                      <th>Head</th>
                      <th>Basis</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEDUCTIONS.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td className="small">{row.note}</td>
                        <td className="calc-amount">₹ {rupees(row.value)}</td>
                      </tr>
                    ))}
                    <tr className="is-total">
                      <td colSpan={2}>Total Deductions</td>
                      <td className="calc-amount">₹ {rupees(deductions)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
      </Row>


      <div className="panel mt-4 no-print">
        <div className="panel-body">
          <div className="download-note">
            <p>
              Your month-wise drawn statement — the salary actually paid, as recorded by the
              treasury — is published on the Koshvani portal of the Government of Uttar Pradesh.
            </p>
            <a
              className="btn-gold"
              href={KOSHVANI_DRAWN_STATEMENT}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-box-arrow-up-right" />
              Drawn Statement
            </a>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              The DA and NPS rates above are only defaults — they are revised by government order
              from time to time. Enter the rates currently applicable to you before relying on the
              result, and treat your monthly salary slip as final. To work out the income tax figure
              for the year, use the <Link href="/employee/it-calculator">IT Calculator</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
