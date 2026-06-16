-- supabase/migrations/0002_rls_policies.sql
-- Row Level Security policies. CRITICAL for multi-tenant isolation.
-- Every table has RLS enabled. Every policy checks that the requesting user
-- either belongs to the same dealership or is the platform admin.

-- Enable RLS on all tables.
alter table public.dealerships     enable row level security;
alter table public.users           enable row level security;
alter table public.courses         enable row level security;
alter table public.lessons         enable row level security;
alter table public.enrollments     enable row level security;
alter table public.progress        enable row level security;
alter table public.kpi_definitions enable row level security;
alter table public.kpi_entries     enable row level security;
alter table public.chat_sessions   enable row level security;
alter table public.chat_messages   enable row level security;
alter table public.activity_log    enable row level security;

-- Helper functions used by policies.
create or replace function public.current_user_dealership_id()
returns uuid as $$
  select dealership_id from public.users where id = auth.uid()
$$ language sql security definer stable;

create or replace function public.current_user_is_admin()
returns boolean as $$
  select coalesce((select role = 'admin' from public.users where id = auth.uid()), false)
$$ language sql security definer stable;

-- DEALERSHIPS: a user can read their own dealership. Admin can read all.
create policy "dealerships_select_own" on public.dealerships for select
  using (id = public.current_user_dealership_id() or public.current_user_is_admin());

create policy "dealerships_admin_all" on public.dealerships for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- USERS: a user can read users in their dealership. Read themselves always. Admin reads all.
create policy "users_select_self" on public.users for select
  using (id = auth.uid());

create policy "users_select_same_dealership" on public.users for select
  using (
    dealership_id is not null
    and dealership_id = public.current_user_dealership_id()
  );

create policy "users_admin_all" on public.users for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

create policy "users_update_self" on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- COURSES: every authenticated user reads published courses. Admin writes.
create policy "courses_select_published" on public.courses for select
  using (status = 'published' or public.current_user_is_admin());

create policy "courses_admin_all" on public.courses for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- LESSONS: every authenticated user reads lessons of published courses. Admin writes.
create policy "lessons_select_published" on public.lessons for select
  using (
    exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
        and (c.status = 'published' or public.current_user_is_admin())
    )
  );

create policy "lessons_admin_all" on public.lessons for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- ENROLLMENTS: a user manages their own. Admin sees all.
create policy "enrollments_self_all" on public.enrollments for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "enrollments_admin_all" on public.enrollments for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- PROGRESS: a user manages their own. Dealership owners/managers can read their team's. Admin sees all.
create policy "progress_self_all" on public.progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "progress_dealership_read" on public.progress for select
  using (
    exists (
      select 1 from public.users u
      where u.id = progress.user_id
        and u.dealership_id is not null
        and u.dealership_id = public.current_user_dealership_id()
        and (select role from public.users where id = auth.uid()) in ('owner', 'manager')
    )
  );

create policy "progress_admin_all" on public.progress for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- KPI DEFINITIONS: every authenticated user reads. Admin writes.
create policy "kpi_definitions_select_all" on public.kpi_definitions for select
  using (auth.uid() is not null);

create policy "kpi_definitions_admin_all" on public.kpi_definitions for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- KPI ENTRIES: a dealership manages their own entries. Admin sees all.
create policy "kpi_entries_dealership_all" on public.kpi_entries for all
  using (dealership_id = public.current_user_dealership_id())
  with check (dealership_id = public.current_user_dealership_id());

create policy "kpi_entries_admin_all" on public.kpi_entries for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- CHAT SESSIONS + MESSAGES: a user accesses only their own.
create policy "chat_sessions_self_all" on public.chat_sessions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "chat_sessions_admin_all" on public.chat_sessions for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

create policy "chat_messages_via_session" on public.chat_messages for all
  using (
    exists (
      select 1 from public.chat_sessions s
      where s.id = chat_messages.session_id
        and (s.user_id = auth.uid() or public.current_user_is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.chat_sessions s
      where s.id = chat_messages.session_id
        and (s.user_id = auth.uid() or public.current_user_is_admin())
    )
  );

-- ACTIVITY LOG: admin reads everything. Dealership owners read their dealership's.
create policy "activity_log_dealership_read" on public.activity_log for select
  using (dealership_id = public.current_user_dealership_id());

create policy "activity_log_admin_all" on public.activity_log for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());
