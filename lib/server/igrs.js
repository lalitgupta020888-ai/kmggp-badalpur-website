import 'server-only';

import { randomInt } from 'node:crypto';

import {
  ALL_SEMESTERS,
  CATEGORIES,
  COURSES,
  DEPARTMENTS,
  PENSION_SCHEMES,
  RELATIONS,
  YEARS,
  semestersFor,
} from '@/lib/igrs';
import { getSection } from './sections';
import { saveLetter } from './igrs-letters';
import { supabaseEnabled, sbRest } from './supabase';

/**
 * IGRS grievances in Supabase — one table per user type.
 *
 * The browser only ever reaches these through server actions. Field names are
 * camelCase in the app and snake_case in the database; the specs below are the
 * single place that translation lives, and they double as an allow-list, so a
 * form can never write a column it does not own.
 *
 * Requires supabase/migrations/20261122000000_igrs_v2.sql (enrollment number,
 * semester, pension scheme and status history columns).
 */

export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const CODE = /^[A-Za-z0-9][A-Za-z0-9/\-. ]{2,29}$/;

/*
 * Each field: column, max length, and an optional `check` that returns an
 * error message (or '') given the cleaned value, the whole cleaned row and the
 * dropdown options.
 */
const inList = (list, message) => (value) => ((list || []).some((o) => o.value === value) ? '' : message);

const COMMON = {
  phone: { column: 'phone', max: 10, check: (v) => (PHONE.test(v) ? '' : 'Enter a valid 10-digit mobile number.') },
  email: { column: 'email', max: 200, check: (v) => (EMAIL.test(v) ? '' : 'Enter a valid email address.') },
  category: { column: 'category', max: 40 },
  subject: { column: 'subject', max: 200 },
  description: { column: 'description', max: 5000, check: (v) => (v.length >= 20 ? '' : 'Please describe the grievance in at least 20 characters.') },
};

const enrollment = {
  column: 'enrollment_number',
  max: 30,
  check: (v) => (CODE.test(v) ? '' : 'Enter a valid enrollment number.'),
};

export const IGRS_TABLES = {
  student: {
    table: 'igrs_student_grievances',
    letter: 'S',
    fields: {
      name: { column: 'name', max: 120 },
      enrollmentNumber: enrollment,
      course: { column: 'course', max: 40, check: (v, _row, o) => inList(o.courses, 'Select your course.')(v) },
      year: { column: 'year', max: 20, check: (v, _row, o) => inList(o.years, 'Select your year.')(v) },
      semester: {
        column: 'semester',
        max: 2,
        check: (v, row) => (semestersFor(row.year).includes(v) && ALL_SEMESTERS.includes(v) ? '' : 'Select a semester that matches your year.'),
      },
      ...COMMON,
    },
  },
  parent: {
    table: 'igrs_parent_grievances',
    letter: 'P',
    // The parent form's "name" input holds the student's name.
    fields: {
      parentName: { column: 'parent_name', max: 120 },
      relation: { column: 'relation', max: 40, check: (v, _row, o) => inList(o.relations, 'Select your relation with the student.')(v) },
      name: { column: 'student_name', max: 120 },
      enrollmentNumber: enrollment,
      ...COMMON,
    },
  },
  employee: {
    table: 'igrs_employee_grievances',
    letter: 'E',
    fields: {
      name: { column: 'name', max: 120 },
      pensionScheme: { column: 'pension_scheme', max: 3, check: inList(PENSION_SCHEMES, 'Choose NPS or GPF.') },
      employeeId: { column: 'employee_id', max: 30, check: (v) => (CODE.test(v) ? '' : 'Enter a valid NPS / GPF number.') },
      department: { column: 'department', max: 40, check: (v, _row, o) => inList(o.departments, 'Select your department.')(v) },
      designation: { column: 'designation', max: 120 },
      ...COMMON,
    },
  },
};

const TYPE_BY_LETTER = Object.fromEntries(Object.entries(IGRS_TABLES).map(([type, spec]) => [spec.letter, type]));

function assertReady() {
  if (!supabaseEnabled()) throw new Error('The grievance database is not configured.');
}

function history(row) {
  return Array.isArray(row.history) ? row.history : [];
}

/** Row (snake_case) → the grievance object the UI understands. */
function fromRow(type, row) {
  const g = {
    type,
    refNumber: row.ref_number,
    status: row.status,
    remarks: row.remarks,
    submittedOn: row.submitted_on,
    lastUpdated: row.last_updated,
    history: history(row),
  };
  for (const [key, spec] of Object.entries(IGRS_TABLES[type].fields)) g[key] = row[spec.column] ?? '';
  // Grievances filed before the enrollment-number change carry a roll number.
  if (!g.enrollmentNumber && row.roll_number) g.enrollmentNumber = row.roll_number;
  return g;
}

/*
 * Reference numbers: GR + type letter + YYMMDD + 5 characters, e.g.
 * GRS261122K7Q4M. The letter tells the status lookup which table to read; the
 * alphabet leaves out 0/O and 1/I so a number read over the phone is not
 * mistyped. ~33 million combinations a day per type, and the primary key
 * rejects the rare clash, which is then retried.
 */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function newRefNumber(type) {
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const date = ist.toISOString().slice(2, 10).replace(/-/g, '');
  let tail = '';
  for (let i = 0; i < 5; i += 1) tail += ALPHABET[randomInt(0, ALPHABET.length)];
  return `GR${IGRS_TABLES[type].letter}${date}${tail}`;
}

/** Validate and store a submission; returns the saved grievance. */
export async function createGrievance(type, data) {
  assertReady();
  const spec = IGRS_TABLES[type];
  if (!spec) throw new Error('Unknown grievance type.');

  // The same dropdown lists the form was built from; built-ins if unreadable.
  const saved = (await getSection('igrs-options').catch(() => null)) || {};
  const options = {
    courses: saved.courses?.length ? saved.courses : COURSES,
    years: saved.years?.length ? saved.years : YEARS,
    relations: saved.relations?.length ? saved.relations : RELATIONS,
    departments: saved.departments?.length ? saved.departments : DEPARTMENTS,
  };

  const clean = {};
  for (const [key, field] of Object.entries(spec.fields)) {
    const raw = String(data?.[key] ?? '');
    // Descriptions keep their line breaks; everything else is one tidy line.
    const tidy = key === 'description' ? raw.trim() : raw.replace(/\s+/g, ' ').trim();
    clean[key] = key === 'phone' ? tidy : tidy.slice(0, field.max);
  }
  // "+91 98765-43210" and "098765 43210" are the same mobile number.
  clean.phone = clean.phone.replace(/\D/g, '').replace(/^(?:91|0)(?=\d{10}$)/, '').slice(0, 15);
  clean.email = clean.email.toLowerCase();
  if (clean.enrollmentNumber) clean.enrollmentNumber = clean.enrollmentNumber.toUpperCase();
  if (clean.employeeId) clean.employeeId = clean.employeeId.toUpperCase();

  const row = {};
  for (const [key, field] of Object.entries(spec.fields)) {
    if (!clean[key]) throw new Error('Please fill in every required field.');
    const problem = field.check?.(clean[key], clean, options);
    if (problem) throw new Error(problem);
    row[field.column] = clean[key];
  }
  if (!CATEGORIES[type].some((c) => c.value === clean.category)) throw new Error('Select a grievance category.');

  const submittedOn = new Date().toISOString();
  row.history = [{ status: 'Pending', remarks: 'Grievance received.', at: submittedOn }];

  // The reference number is the primary key, so a collision fails the insert
  // with 409 and another number is tried.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const [saved] = await sbRest(spec.table, {
        method: 'POST',
        body: { ...row, ref_number: newRefNumber(type), submitted_on: submittedOn, last_updated: submittedOn },
        prefer: 'return=representation',
      });
      return fromRow(type, saved);
    } catch (error) {
      if (error.status === 409) continue;
      throw error;
    }
  }
  throw new Error('Could not generate a reference number. Please try again.');
}

const PUBLIC_COLUMNS = 'ref_number,category,subject,status,remarks,submitted_on,last_updated,history';

/**
 * Public status lookup by reference number. Returns only what a tracker needs —
 * no name, email or phone — because anyone holding a number can call this.
 */
export async function findGrievancePublic(refNumber) {
  assertReady();
  const ref = String(refNumber || '').replace(/\s+/g, '').toUpperCase();
  if (!/^GR[0-9A-Z]{6,30}$/.test(ref)) return null;

  // New numbers name their table; older ones (GR + digits) may be in any.
  const known = TYPE_BY_LETTER[ref[2]];
  const order = known ? [known] : Object.keys(IGRS_TABLES);

  for (const type of order) {
    const rows = await sbRest(
      `${IGRS_TABLES[type].table}?ref_number=eq.${encodeURIComponent(ref)}&select=${PUBLIC_COLUMNS}`,
    );
    if (rows?.length) {
      const r = rows[0];
      return {
        type,
        refNumber: r.ref_number,
        category: r.category,
        subject: r.subject,
        status: r.status,
        remarks: r.remarks,
        submittedOn: r.submitted_on,
        lastUpdated: r.last_updated,
        history: history(r),
      };
    }
  }
  return null;
}

/** Every grievance from all three tables, newest first (committee only). */
export async function listAllGrievances() {
  assertReady();
  const PAGE = 1000;
  const lists = await Promise.all(
    Object.entries(IGRS_TABLES).map(async ([type, spec]) => {
      const all = [];
      // Page through, so the dashboard never silently drops older cases.
      for (let offset = 0; ; offset += PAGE) {
        const rows =
          (await sbRest(`${spec.table}?select=*&order=submitted_on.desc&limit=${PAGE}&offset=${offset}`)) || [];
        all.push(...rows.map((row) => fromRow(type, row)));
        if (rows.length < PAGE) break;
      }
      return all;
    }),
  );
  return lists.flat().sort((a, b) => String(b.submittedOn).localeCompare(String(a.submittedOn)));
}

/**
 * Record a committee update on one grievance (committee only).
 *
 * - Remarks are typed fresh for every update; an empty remark is refused.
 * - Marking a case Resolved needs a resolution letter (PDF) unless one is
 *   already on file; any other update may attach a letter too.
 * - Each update is appended to the case history, which the public tracker
 *   shows as a timeline, with the letter to download.
 *
 * Returns `{ grievance, changed, letter }` — `letter` carries the stored file
 * (and its bytes, for the email) when one was attached.
 */
export async function updateGrievanceStatus(type, refNumber, status, remarks, { letter: upload } = {}) {
  assertReady();
  const spec = IGRS_TABLES[type];
  if (!spec) throw new Error('Unknown grievance type.');
  if (!STATUSES.includes(status)) throw new Error('Unknown status.');

  const target = `${spec.table}?ref_number=eq.${encodeURIComponent(refNumber)}`;
  const [current] = (await sbRest(`${target}&select=*`)) || [];
  if (!current) throw new Error('Grievance not found.');

  const text = String(remarks || '').trim().slice(0, 2000);
  if (!text) throw new Error('Type the committee remarks for this update.');

  const hasFile = Boolean(upload && typeof upload === 'object' && upload.size > 0);
  const past = history(current);
  if (status === 'Resolved' && !hasFile && !past.some((h) => h.letter?.file)) {
    throw new Error('Attach the resolution letter (PDF) to mark this grievance Resolved.');
  }
  if (!hasFile && current.status === status && String(current.remarks || '').trim() === text) {
    return { grievance: fromRow(type, current), changed: false, letter: null };
  }

  const letter = hasFile ? await saveLetter(current.ref_number, upload) : null;

  const at = new Date().toISOString();
  const entry = { status, remarks: text, at };
  if (letter) entry.letter = { file: letter.file, name: letter.name, size: letter.size };

  const rows = await sbRest(target, {
    method: 'PATCH',
    body: { status, remarks: text, last_updated: at, history: [...past, entry].slice(-50) },
    prefer: 'return=representation',
  });
  if (!rows?.length) throw new Error('Grievance not found.');
  return { grievance: fromRow(type, rows[0]), changed: true, letter };
}
