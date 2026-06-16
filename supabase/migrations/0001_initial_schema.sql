-- supabase/migrations/0001_initial_schema.sql
-- J|13 Dealer Academy initial database schema.
-- Multi-tenant B2B SaaS structure: dealerships have users, users have progress,
-- KPIs link back to training content.

-- Dealerships are the primary customer entity.
create table public.dealerships (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text unique not null,
  subscription_status text not null default 'trial',
  subscription_tier   text not null default 'starter',
  seat_limit          integer not null default 10,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Users belong to a dealership, except for the platform admin (Jazz) who has dealership_id null.
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  dealership_id uuid references public.dealerships(id) on delete set null,
  email         text unique not null,
  full_name     text,
  role          text not null default 'employee',
  job_function  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint role_valid check (role in ('admin', 'owner', 'manager', 'employee')),
  constraint job_function_valid check (
    job_function is null or job_function in ('sales', 'fi', 'service', 'parts', 'management')
  )
);

-- Courses are top-level training units grouped by department.
create table public.courses (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  department      text not null,
  description     text,
  cover_image_url text,
  position        integer not null default 0,
  status          text not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint department_valid check (department in ('sales', 'fi', 'service', 'parts', 'management')),
  constraint status_valid check (status in ('draft', 'published', 'archived'))
);

-- Lessons are the actual video content inside a course.
create table public.lessons (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid not null references public.courses(id) on delete cascade,
  slug             text not null,
  title            text not null,
  description      text,
  video_url        text,
  duration_seconds integer,
  position         integer not null default 0,
  resources        jsonb default '[]'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (course_id, slug)
);

-- A user enrolling in a course.
create table public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  course_id    uuid not null references public.courses(id) on delete cascade,
  enrolled_at  timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

-- Per-lesson progress per user.
create table public.progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  lesson_id        uuid not null references public.lessons(id) on delete cascade,
  status           text not null default 'not_started',
  watched_seconds  integer not null default 0,
  completed_at     timestamptz,
  updated_at       timestamptz not null default now(),
  unique (user_id, lesson_id),
  constraint status_valid check (status in ('not_started', 'in_progress', 'completed'))
);

-- KPI definitions are the catalog of metrics Jazz wants dealerships to track.
create table public.kpi_definitions (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  department         text not null,
  unit               text not null default 'count',
  target_value       numeric,
  description        text,
  related_course_ids uuid[] default '{}',
  created_at         timestamptz not null default now(),
  constraint department_valid check (department in ('sales', 'fi', 'service', 'parts', 'management')),
  constraint unit_valid check (unit in ('dollars', 'percent', 'ratio', 'count'))
);

-- KPI entries are a dealership's logged values per month per metric.
create table public.kpi_entries (
  id                uuid primary key default gen_random_uuid(),
  dealership_id     uuid not null references public.dealerships(id) on delete cascade,
  kpi_definition_id uuid not null references public.kpi_definitions(id) on delete restrict,
  period_month      date not null,
  value             numeric not null,
  notes             text,
  entered_by        uuid references public.users(id) on delete set null,
  created_at        timestamptz not null default now(),
  unique (dealership_id, kpi_definition_id, period_month)
);

-- Chat sessions for the AI coaching feature, schema stubbed for future build.
create table public.chat_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  context        text not null default 'general',
  context_ref_id uuid,
  created_at     timestamptz not null default now(),
  constraint context_valid check (context in ('general', 'lesson', 'roleplay', 'kpi_review'))
);

create table public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role       text not null,
  content    text not null,
  created_at timestamptz not null default now(),
  constraint role_valid check (role in ('user', 'assistant', 'system'))
);

-- Activity log for audit trail of data modifications.
create table public.activity_log (
  id            uuid primary key default gen_random_uuid(),
  dealership_id uuid references public.dealerships(id) on delete set null,
  user_id       uuid references public.users(id) on delete set null,
  entity_type   text not null,
  entity_id     uuid not null,
  action        text not null,
  metadata      jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

-- Indexes for the queries we expect to run.
create index idx_users_dealership_id      on public.users(dealership_id);
create index idx_lessons_course_id        on public.lessons(course_id);
create index idx_enrollments_user_id      on public.enrollments(user_id);
create index idx_enrollments_course_id    on public.enrollments(course_id);
create index idx_progress_user_id         on public.progress(user_id);
create index idx_progress_lesson_id       on public.progress(lesson_id);
create index idx_kpi_entries_dealership   on public.kpi_entries(dealership_id);
create index idx_kpi_entries_period       on public.kpi_entries(period_month);
create index idx_chat_sessions_user_id    on public.chat_sessions(user_id);
create index idx_chat_messages_session_id on public.chat_messages(session_id);
create index idx_activity_log_dealership  on public.activity_log(dealership_id);
create index idx_activity_log_entity      on public.activity_log(entity_type, entity_id);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger dealerships_set_updated_at before update on public.dealerships
  for each row execute function public.set_updated_at();
create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses
  for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();
create trigger progress_set_updated_at before update on public.progress
  for each row execute function public.set_updated_at();
