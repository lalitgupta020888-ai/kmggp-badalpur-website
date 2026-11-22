-- IGRS v2: enrollment numbers, semester, NPS/GPF scheme and a status history.
--
-- Purely additive, so it is safe to run while the previous site version is
-- still live (that version keeps writing roll_number, which stays). Run this
-- BEFORE deploying the code that uses it.

-- Students: enrollment number replaces roll number; semester alongside year.
alter table public.igrs_student_grievances
  add column if not exists enrollment_number text,
  add column if not exists semester          text,
  add column if not exists history           jsonb not null default '[]'::jsonb;
alter table public.igrs_student_grievances alter column roll_number drop not null;

-- Parents: the student's enrollment number.
alter table public.igrs_parent_grievances
  add column if not exists enrollment_number text,
  add column if not exists history           jsonb not null default '[]'::jsonb;
alter table public.igrs_parent_grievances alter column roll_number drop not null;

-- Faculty / staff: employee_id now holds the NPS (PRAN) or GPF number.
alter table public.igrs_employee_grievances
  add column if not exists pension_scheme text,
  add column if not exists history        jsonb not null default '[]'::jsonb;

-- Carry existing roll numbers across so old cases show an identifier.
update public.igrs_student_grievances set enrollment_number = roll_number
  where enrollment_number is null and roll_number is not null;
update public.igrs_parent_grievances set enrollment_number = roll_number
  where enrollment_number is null and roll_number is not null;

-- Seed each existing case's history with its current state.
update public.igrs_student_grievances  set history = jsonb_build_array(jsonb_build_object('status', status, 'remarks', remarks, 'at', last_updated)) where history = '[]'::jsonb;
update public.igrs_parent_grievances   set history = jsonb_build_array(jsonb_build_object('status', status, 'remarks', remarks, 'at', last_updated)) where history = '[]'::jsonb;
update public.igrs_employee_grievances set history = jsonb_build_array(jsonb_build_object('status', status, 'remarks', remarks, 'at', last_updated)) where history = '[]'::jsonb;

-- Let the REST API see the new columns immediately.
notify pgrst, 'reload schema';
