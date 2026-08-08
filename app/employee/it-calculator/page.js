"use client";

import React, { useMemo, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

/**
 * Income tax calculator for salaried staff — New Regime only, which is what the
 * department's own calculator computes.
 *
 * The working follows the standard order: salary drawn month by month, employer
 * NPS added into salary and then taken out again under 80CCD(2), standard
 * deduction, other income, slab tax, rebate, marginal relief, cess, and finally
 * the balance against TDS already deducted.
 *
 * Slabs and limits are those of the year named in FINANCIAL_YEAR. They are plain
 * data — a Finance Act revision means editing this block and the label, nothing
 * in the arithmetic assumes a particular set of slabs.
 */
const FINANCIAL_YEAR = 'FY 2026-27';
const ASSESSMENT_YEAR = 'AY 2027-28';

/**
 * The slabs below are those last notified. Until the Finance Act for
 * FINANCIAL_YEAR revises them they continue unchanged — the page says as much
 * so nobody takes an unrevised figure as settled.
 */
const SLABS_AS_NOTIFIED_FOR = 'FY 2025-26';

const STANDARD_DEDUCTION = 75000;
const REBATE_LIMIT = 1200000;
const REBATE_CAP = 60000;
const CESS_RATE = 4;
const FAMILY_PENSION_CAP = 25000;

const SLABS = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 5 },
  { upto: 1200000, rate: 10 },
  { upto: 1600000, rate: 15 },
  { upto: 2000000, rate: 20 },
  { upto: 2400000, rate: 25 },
  { upto: Infinity, rate: 30 },
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Salary is entered as drawn — March 2026 through February 2027, since March's
 * pay reaches the bank in April and so falls in the financial year below.
 * Rolling the table to the next year is a matter of moving these two numbers.
 */
const START_MONTH_INDEX = 2; // March
const START_YEAR = 2026;

const MONTHS = Array.from({ length: 12 }, (unused, offset) => {
  const index = START_MONTH_INDEX + offset;
  return `${MONTH_NAMES[index % 12]} ${START_YEAR + Math.floor(index / 12)}`;
});

/** Four extra rows for anything drawn outside the monthly cycle. */
const EXTRA_ROWS = ['Bonus', 'Pay Arrear', 'DA Arrear', 'Other Arrear'];

const ROW_LABELS = [...MONTHS, ...EXTRA_ROWS];

/**
 * Gross and net are derived from the row, not typed — gross is what was earned,
 * net is what reached the bank after the employee's own deductions. Employer NPS
 * is not deducted from net: it is the government's contribution, not the
 * employee's, even though it forms part of taxable salary.
 */
const COLUMNS = [
  { key: 'basic', label: 'Basic Salary' },
  { key: 'da', label: 'DA' },
  { key: 'other', label: 'Other Allow.' },
  { key: 'gross', label: 'Gross Salary', computed: true },
  { key: 'npsGpf', label: 'NPS / GPF' },
  { key: 'gis', label: 'GIS' },
  { key: 'empNps', label: 'Emp. NPS 14%' },
  { key: 'tds', label: 'TDS' },
  { key: 'net', label: 'Net Salary', computed: true },
];

const INPUT_COLUMNS = COLUMNS.filter((column) => !column.computed);

const EMPTY_ROW = INPUT_COLUMNS.reduce((row, column) => ({ ...row, [column.key]: '' }), {});

const DETAIL_FIELDS = [
  { key: 'office', label: 'Office Name', placeholder: 'e.g. DDO Name' },
  { key: 'name', label: 'Employee Name', placeholder: 'Full Name' },
  { key: 'designation', label: 'Designation', placeholder: 'e.g. Lecturer' },
  { key: 'pan', label: 'PAN Number', placeholder: 'ABCDE1234F', maxLength: 10 },
  { key: 'ehrm', label: 'EHRM Code', placeholder: 'EHRM Code' },
];

const OTHER_INCOME_FIELDS = [
  { key: 'savings', label: 'Interest — Savings A/c (₹)' },
  { key: 'fd', label: 'Interest — Fixed Deposits (₹)' },
  { key: 'other', label: 'Other Income, if any (₹)' },
  { key: 'familyPension', label: 'Family Pension (₹)' },
];

const num = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const rupees = (value) =>
  Math.round(value).toLocaleString('en-IN', { maximumFractionDigits: 0 });

const rowGross = (row) => num(row.basic) + num(row.da) + num(row.other);

const rowNet = (row) => rowGross(row) - num(row.npsGpf) - num(row.gis) - num(row.tds);

const slabLabel = (from, upto) => {
  if (upto === Infinity) return `Above ₹ ${rupees(from)}`;
  if (from === 0) return `Up to ₹ ${rupees(upto)}`;
  return `₹ ${rupees(from)} – ₹ ${rupees(upto)}`;
};

/** Slab tax on a taxable figure, with the band-by-band working alongside. */
function slabTax(taxable) {
  let previous = 0;
  let tax = 0;
  const rows = [];

  for (const slab of SLABS) {
    const inSlab = Math.max(0, Math.min(taxable, slab.upto) - previous);
    const amount = (inSlab * slab.rate) / 100;
    rows.push({ band: slabLabel(previous, slab.upto), rate: slab.rate, inSlab, tax: amount });
    tax += amount;
    previous = slab.upto;
    if (taxable <= slab.upto) break;
  }

  return { tax, rows };
}

export default function ItCalculator() {
  const [details, setDetails] = useState({
    office: '',
    name: '',
    designation: '',
    pan: '',
    ehrm: '',
  });
  const [rows, setRows] = useState(() => ROW_LABELS.map(() => ({ ...EMPTY_ROW })));
  const [otherIncome, setOtherIncome] = useState({
    savings: '',
    fd: '',
    other: '',
    familyPension: '',
  });

  const updateDetail = (key) => (event) =>
    setDetails({ ...details, [key]: event.target.value });

  const updateOther = (key) => (event) =>
    setOtherIncome({ ...otherIncome, [key]: event.target.value });

  const updateCell = (rowIndex, key) => (event) => {
    const value = event.target.value;
    setRows((current) =>
      current.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row))
    );
  };

  const reset = () => {
    setDetails({ office: '', name: '', designation: '', pan: '', ehrm: '' });
    setRows(ROW_LABELS.map(() => ({ ...EMPTY_ROW })));
    setOtherIncome({ savings: '', fd: '', other: '', familyPension: '' });
  };

  const result = useMemo(() => {
    const totals = INPUT_COLUMNS.reduce((acc, column) => {
      acc[column.key] = rows.reduce((sum, row) => sum + num(row[column.key]), 0);
      return acc;
    }, {});

    totals.gross = rows.reduce((sum, row) => sum + rowGross(row), 0);
    totals.net = rows.reduce((sum, row) => sum + rowNet(row), 0);

    const grossSalary = totals.gross;
    const employerNps = totals.empNps;
    const tdsDeducted = totals.tds;

    // Employer NPS is part of salary, then taken out again under 80CCD(2).
    // Floored at zero: salary income can be nil, never negative, so a standard
    // deduction larger than the salary drawn does not offset other income.
    const netTaxableSalary = Math.max(0, grossSalary + employerNps - STANDARD_DEDUCTION);

    const familyPension = num(otherIncome.familyPension);
    const familyPensionRelief = Math.min(familyPension / 3, FAMILY_PENSION_CAP);
    const totalOtherIncome =
      num(otherIncome.savings) +
      num(otherIncome.fd) +
      num(otherIncome.other) +
      Math.max(0, familyPension - familyPensionRelief);

    const grossTotalIncome = Math.max(
      0,
      netTaxableSalary + totalOtherIncome - employerNps
    );

    const { tax: basicTax, rows: slabRows } = slabTax(grossTotalIncome);

    const rebate = grossTotalIncome <= REBATE_LIMIT ? Math.min(basicTax, REBATE_CAP) : 0;
    const afterRebate = Math.max(0, basicTax - rebate);

    // 87A(b): just past the rebate limit, tax may not exceed the income above it.
    const excessOverLimit = Math.max(0, grossTotalIncome - REBATE_LIMIT);
    const marginalRelief =
      grossTotalIncome > REBATE_LIMIT && afterRebate > excessOverLimit
        ? afterRebate - excessOverLimit
        : 0;

    const taxAfterRelief = Math.max(0, afterRebate - marginalRelief);
    const cess = (taxAfterRelief * CESS_RATE) / 100;
    const netTaxPayable = taxAfterRelief + cess;

    return {
      totals,
      grossSalary,
      employerNps,
      netTaxableSalary,
      familyPensionRelief,
      totalOtherIncome,
      grossTotalIncome,
      basicTax,
      rebate,
      marginalRelief,
      taxAfterRelief,
      cess,
      netTaxPayable,
      tdsDeducted,
      balance: netTaxPayable - tdsDeducted,
      monthlyTds: netTaxPayable / 12,
      slabRows,
    };
  }, [rows, otherIncome]);

  const SUMMARY = [
    { label: 'Gross Salary', value: result.grossSalary },
    { label: 'Add — Employer NPS 14%', value: result.employerNps, sign: '+' },
    { label: 'Less — Standard Deduction', value: STANDARD_DEDUCTION, sign: '−' },
    { label: 'Net Taxable Salary', value: result.netTaxableSalary, strong: true },
    { label: 'Add — Total Other Income', value: result.totalOtherIncome, sign: '+' },
    { label: 'Less — NPS 80CCD(2) 14%', value: result.employerNps, sign: '−' },
    { label: 'Gross Total Income', value: result.grossTotalIncome, strong: true },
    { label: 'Basic Income Tax', value: result.basicTax },
    { label: 'Less — Rebate u/s 87A', value: result.rebate, sign: '−' },
    { label: 'Less — Marginal Relief u/s 87A(b)', value: result.marginalRelief, sign: '−' },
    { label: 'Tax After Rebate', value: result.taxAfterRelief, strong: true },
    { label: `Add — Health & Education Cess @ ${CESS_RATE}%`, value: result.cess, sign: '+' },
    { label: 'Net Tax Payable', value: result.netTaxPayable, total: true },
    { label: 'Less — TDS Already Deducted', value: result.tdsDeducted, sign: '−' },
  ];

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-percent" />
          Income Tax Calculator — New Tax Regime
        </div>
        <div className="panel-body">
          <p className="lead">
            Computation of income tax for salaried employees under the new tax regime. Enter your
            salary as drawn month by month; the statement below is worked out as you type and
            nothing you enter is stored or sent anywhere.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            <span className="status-pill is-meta">
              <i className="bi bi-calendar3 me-2" />
              {FINANCIAL_YEAR} | {ASSESSMENT_YEAR}
            </span>
            <span className="status-pill is-meta">
              <i className="bi bi-diagram-3 me-2" />
              New Tax Regime
            </span>
            <span className="status-pill is-meta">
              <i className="bi bi-person-badge me-2" />
              Salaried Employees
            </span>
          </div>

          <div className="gold-rule-thin my-4" />

          <h6 className="fw-bold mb-3">
            <i className="bi bi-bar-chart-steps text-gold me-2" />
            Income Tax Slabs — New Regime, as notified for {SLABS_AS_NOTIFIED_FOR}
          </h6>

          <div className="slab-strip">
            {SLABS.map((slab, index) => {
              const from = index === 0 ? 0 : SLABS[index - 1].upto;
              return (
                <div className="slab-chip" key={slab.upto}>
                  <span className="slab-chip-band">{slabLabel(from, slab.upto)}</span>
                  <span className="slab-chip-rate">{slab.rate === 0 ? 'NIL' : `${slab.rate}%`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-person-vcard" />
          Employee Details
        </div>
        <div className="panel-body">
          <Form className="premium-form">
            <Row className="g-3">
              {DETAIL_FIELDS.map((field) => (
                <Col md={4} key={field.key}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    value={details[field.key]}
                    onChange={updateDetail(field.key)}
                  />
                </Col>
              ))}
            </Row>
          </Form>
          <p className="small mb-0 mt-3">
            These details appear on the printed statement only — they take no part in the
            computation.
          </p>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-table" />
          Monthly Salary Details
        </div>
        <div className="panel-body p-0">
          <div className="table-wrap">
            <table className="premium-table salary-table">
              <thead>
                <tr>
                  <th>Month</th>
                  {COLUMNS.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROW_LABELS.map((label, index) => (
                  <tr key={label} className={index >= MONTHS.length ? 'is-extra' : ''}>
                    <td className="salary-month">{label}</td>
                    {COLUMNS.map((column) => {
                      if (column.computed) {
                        const value =
                          column.key === 'gross' ? rowGross(rows[index]) : rowNet(rows[index]);
                        return (
                          <td key={column.key} className="salary-computed">
                            {rupees(value)}
                          </td>
                        );
                      }

                      return (
                        <td key={column.key}>
                          <input
                            className="salary-input"
                            type="number"
                            min="0"
                            inputMode="numeric"
                            aria-label={`${label} — ${column.label}`}
                            value={rows[index][column.key]}
                            onChange={updateCell(index, column.key)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="is-total">
                  <td>Total</td>
                  {COLUMNS.map((column) => (
                    <td key={column.key} className="calc-amount">
                      ₹ {rupees(result.totals[column.key])}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-cash-coin" />
          Other Income Details
        </div>
        <div className="panel-body">
          <Form className="premium-form">
            <Row className="g-3">
              {OTHER_INCOME_FIELDS.map((field) => (
                <Col md={3} key={field.key}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0"
                    value={otherIncome[field.key]}
                    onChange={updateOther(field.key)}
                  />
                </Col>
              ))}
            </Row>
          </Form>

          {result.familyPensionRelief > 0 && (
            <p className="small mb-0 mt-3">
              <i className="bi bi-info-circle-fill text-gold me-2" />
              Standard deduction on family pension applied: ₹ {rupees(result.familyPensionRelief)} —
              the lower of one-third of the pension or ₹ {rupees(FAMILY_PENSION_CAP)}.
            </p>
          )}
        </div>
      </div>

      <Row className="g-4 mt-0">
        <Col md={4}>
          <div className="calc-tile h-100">
            <span className="calc-tile-label">Gross Total Income</span>
            <span className="calc-tile-value">₹ {rupees(result.grossTotalIncome)}</span>
            <span className="calc-tile-note">After standard deduction and 80CCD(2)</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="calc-tile calc-tile-primary h-100">
            <span className="calc-tile-label">Net Tax Payable</span>
            <span className="calc-tile-value">₹ {rupees(result.netTaxPayable)}</span>
            <span className="calc-tile-note">For the year, including cess</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="calc-tile h-100">
            <span className="calc-tile-label">
              {result.balance >= 0 ? 'Balance TDS' : 'Refund Due'}
            </span>
            <span className="calc-tile-value">₹ {rupees(Math.abs(result.balance))}</span>
            <span className="calc-tile-note">
              {result.balance >= 0 ? 'Still to be deducted' : 'Deducted in excess'}
            </span>
          </div>
        </Col>
      </Row>

      <Row className="g-4 mt-0">
        <Col lg={7}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-file-earmark-text" />
              Tax Computation Summary
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table calc-table">
                  <tbody>
                    {SUMMARY.map((line) => (
                      <tr
                        key={line.label}
                        className={line.total ? 'is-total' : line.strong ? 'is-subtotal' : ''}
                      >
                        <td>{line.label}</td>
                        <td className="calc-amount">
                          {line.sign ? `${line.sign} ` : ''}₹ {rupees(line.value)}
                        </td>
                      </tr>
                    ))}
                    <tr className="is-total">
                      <td>{result.balance >= 0 ? 'Balance TDS Payable' : 'Refund Due'}</td>
                      <td className="calc-amount">₹ {rupees(Math.abs(result.balance))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={5}>
          <div className="panel">
            <div className="panel-header">
              <i className="bi bi-bar-chart-steps" />
              Tax Slab Breakdown
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table calc-table">
                  <thead>
                    <tr>
                      <th>Slab</th>
                      <th>Rate</th>
                      <th>Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.slabRows.map((row) => (
                      <tr key={row.band}>
                        <td className="small">{row.band}</td>
                        <td>{row.rate === 0 ? 'NIL' : `${row.rate}%`}</td>
                        <td className="calc-amount">₹ {rupees(row.tax)}</td>
                      </tr>
                    ))}
                    <tr className="is-total">
                      <td colSpan={2}>Basic Income Tax</td>
                      <td className="calc-amount">₹ {rupees(result.basicTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="calc-tile calc-tile-primary mt-4">
            <span className="calc-tile-label">Suggested Monthly TDS</span>
            <span className="calc-tile-value">₹ {rupees(result.monthlyTds)}</span>
            <span className="calc-tile-note">Net tax payable ÷ 12</span>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4 no-print">
            <Button className="btn-gold" onClick={() => window.print()}>
              <i className="bi bi-printer-fill" />
              Print Statement
            </Button>
            <Button className="btn-outline-navy" onClick={reset}>
              <i className="bi bi-arrow-counterclockwise" />
              Reset
            </Button>
          </div>
        </Col>
      </Row>

      <div className="panel mt-4">
        <div className="panel-body">
          <div className="callout">
            <i className="bi bi-exclamation-triangle-fill" />
            <p>
              The slabs, the ₹ {rupees(STANDARD_DEDUCTION)} standard deduction and the section 87A
              rebate used here are those notified for <strong>{SLABS_AS_NOTIFIED_FOR}</strong>, which
              continue until the Finance Act for {FINANCIAL_YEAR} revises them. Confirm the current
              rates before relying on the result. Surcharge on high incomes, relief under section 89
              and the separate slabs for senior citizens are not covered.
            </p>
          </div>

          <div className="callout mt-3">
            <i className="bi bi-info-circle-fill" />
            <p>
              This is a guidance tool, not a tax computation statement. Confirm the figures with the
              institute establishment section or a tax practitioner before filing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
