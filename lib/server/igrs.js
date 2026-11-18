import 'server-only';

import { randomInt } from 'node:crypto';

import { supabaseEnabled, sbRest } from './supabase';

/**
 * IGRS grievances in Supabase — one table per user type.
 *
 * The browser only ever reaches these through server actions. Field names are
 * camelCase in the app and snake_case in the database; the maps below are the
 * single place that translation lives, and they double as an allow-list, so a
 * form can never write a column it does not own.
 */

export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const COMMON = {
  email: 'email',
  phone: 'phone',
  category: 'category',
  subject: 'subject',
  description: 'description',
};

export const IGRS_TABLES = {
  student: {
    table: 'igrs_student_grievances',
    fields: { name: 'name', rollNumber: 'roll_number', course: 'course', year: 'year', ...COMMON },
  },
  parent: {
    table: 'igrs_parent_grievances',
    // The parent form's "name" input holds the student's name.
    fields: {
      parentName: 'parent_name',
      relation: 'relation',
      name: 'student_name',
      rollNumber: 'roll_number',
      ...COMMON,
    },
  },
  employee: {
    table: 'igrs_employee_grievances',
    fields: {
      name: 'name',
      employeeId: 'employee_id',
      department: 'department',
      designation: 'designation',
      ...COMMON,
    },
  },
};

const LIMITS = { description: 5000, subject: 200 };

function assertReady() {
  if (!supabaseEnabled()) throw new Error('The grievance database is not configured.');
}

/** Row (snake_case) → the grievance object the UI already understands. */
function fromRow(type, row) {
  const g = {
    type,
    refNumber: row.ref_number,
    status: row.status,
    remarks: row.remarks,
    submittedOn: row.submitted_on,
    lastUpdated: row.last_updated,
  };
  for (const [key, column] of Object.entries(IGRS_TABLES[type].fields)) g[key] = row[column];
  return g;
}

function newRefNumber() {
  // GR + 8 timestamp digits + 5 random digits — the same shape as before.
  return `GR${Date.now().toString().slice(-8)}${String(randomInt(0, 100000)).padStart(5, '0')}`;
}

/** Validate and store a submission; returns the saved grievance. */
export async function createGrievance(type, data) {
  assertReady();
  const spec = IGRS_TABLES[type];
  if (!spec) throw new Error('Unknown grievance type.');

  const row = {};
  for (const [key, column] of Object.entries(spec.fields)) {
    const value = String(data?.[key] ?? '').trim().slice(0, LIMITS[key] || 300);
    if (!value) throw new Error('Please fill in every required field.');
    row[column] = value;
  }
  if (!/^\S+@\S+\.\S+$/.test(row.email)) throw new Error('Please enter a valid email address.');

  // The reference number is the primary key, so a collision fails the insert
  // with 409 and another number is tried.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const [saved] = await sbRest(spec.table, {
        method: 'POST',
        body: { ...row, ref_number: newRefNumber() },
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

/**
 * Public status lookup by reference number. Returns only what a tracker needs —
 * no name, email or phone — because anyone holding a number can call this.
 */
export async function findGrievancePublic(refNumber) {
  assertReady();
  const ref = String(refNumber || '').trim().toUpperCase();
  if (!/^GR[0-9A-Z]{6,30}$/.test(ref)) return null;

  for (const [type, spec] of Object.entries(IGRS_TABLES)) {
    const rows = await sbRest(
      `${spec.table}?ref_number=eq.${encodeURIComponent(ref)}` +
        '&select=ref_number,category,subject,status,remarks,submitted_on,last_updated',
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
      };
    }
  }
  return null;
}

/** Every grievance from all three tables, newest first (committee only). */
export async function listAllGrievances() {
  assertReady();
  const lists = await Promise.all(
    Object.entries(IGRS_TABLES).map(async ([type, spec]) => {
      const rows = await sbRest(`${spec.table}?select=*&order=submitted_on.desc&limit=1000`);
      return (rows || []).map((row) => fromRow(type, row));
    }),
  );
  return lists.flat().sort((a, b) => String(b.submittedOn).localeCompare(String(a.submittedOn)));
}

/** Change status/remarks on one grievance (committee only). */
export async function updateGrievanceStatus(type, refNumber, status, remarks) {
  assertReady();
  const spec = IGRS_TABLES[type];
  if (!spec) throw new Error('Unknown grievance type.');
  if (!STATUSES.includes(status)) throw new Error('Unknown status.');

  const rows = await sbRest(`${spec.table}?ref_number=eq.${encodeURIComponent(refNumber)}`, {
    method: 'PATCH',
    body: {
      status,
      remarks: String(remarks || '').trim().slice(0, 2000) || 'Under review.',
      last_updated: new Date().toISOString(),
    },
    prefer: 'return=representation',
  });
  if (!rows?.length) throw new Error('Grievance not found.');
  return fromRow(type, rows[0]);
}
