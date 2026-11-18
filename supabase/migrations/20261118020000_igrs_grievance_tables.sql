-- IGRS grievances, one table per user type. Only the website server
-- (service_role) can read or write; RLS blocks the public keys entirely.

create table if not exists public.igrs_student_grievances (
  ref_number   text primary key,
  name         text not null,
  roll_number  text not null,
  course       text not null,
  year         text not null,
  email        text not null,
  phone        text not null,
  category     text not null,
  subject      text not null,
  description  text not null,
  status       text not null default 'Pending'
               check (status in ('Pending', 'In Progress', 'Resolved', 'Rejected')),
  remarks      text not null default 'Your grievance has been received and is under review.',
  submitted_on timestamptz not null default now(),
  last_updated timestamptz not null default now()
);

create table if not exists public.igrs_parent_grievances (
  ref_number   text primary key,
  parent_name  text not null,
  relation     text not null,
  student_name text not null,
  roll_number  text not null,
  email        text not null,
  phone        text not null,
  category     text not null,
  subject      text not null,
  description  text not null,
  status       text not null default 'Pending'
               check (status in ('Pending', 'In Progress', 'Resolved', 'Rejected')),
  remarks      text not null default 'Your grievance has been received and is under review.',
  submitted_on timestamptz not null default now(),
  last_updated timestamptz not null default now()
);

create table if not exists public.igrs_employee_grievances (
  ref_number   text primary key,
  name         text not null,
  employee_id  text not null,
  department   text not null,
  designation  text not null,
  email        text not null,
  phone        text not null,
  category     text not null,
  subject      text not null,
  description  text not null,
  status       text not null default 'Pending'
               check (status in ('Pending', 'In Progress', 'Resolved', 'Rejected')),
  remarks      text not null default 'Your grievance has been received and is under review.',
  submitted_on timestamptz not null default now(),
  last_updated timestamptz not null default now()
);

alter table public.igrs_student_grievances  enable row level security;
alter table public.igrs_parent_grievances   enable row level security;
alter table public.igrs_employee_grievances enable row level security;

create index if not exists igrs_student_status_idx  on public.igrs_student_grievances  (status, submitted_on desc);
create index if not exists igrs_parent_status_idx   on public.igrs_parent_grievances   (status, submitted_on desc);
create index if not exists igrs_employee_status_idx on public.igrs_employee_grievances (status, submitted_on desc);

grant select, insert, update, delete on public.igrs_student_grievances  to service_role;
grant select, insert, update, delete on public.igrs_parent_grievances   to service_role;
grant select, insert, update, delete on public.igrs_employee_grievances to service_role;
