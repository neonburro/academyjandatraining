-- supabase/migrations/0003_j13_content_model.sql
-- The J13 content and evaluation model. This is the structured spine the whole
-- Academy runs on: the 13 master steps, knowledge checks, per-user progression,
-- commitments, manager sign-offs, coach memory and the activity stream.
--
-- RUN MANUALLY by Tyler against fiowfatqsqagehngburd until the MCP connector is
-- re-authorized. The app runs local-first (src/lib/progressStore.js) until this
-- migration exists, then the store swaps to these tables with the same interface.
--
-- Design notes:
-- * steps.content and steps.manager_content are jsonb mirroring src/content
--   module shapes, so seeding is a direct upload of the extracted manuals.
-- * Master content only in this phase. Dealership-custom overrides arrive in
--   Phase 4 as separate tables, never as mutations of master rows.
-- * knowledge_check_questions.answer_index is readable by members in this
--   phase. Acceptable for v1; server-side grading arrives with Phase 2.

-- ============================== TABLES ==============================

create table public.steps (
  id              uuid primary key default gen_random_uuid(),
  number          integer unique not null check (number between 1 and 13),
  slug            text unique not null,
  title           text not null,
  purpose         text not null,
  content         jsonb not null default '{}'::jsonb,
  manager_content jsonb not null default '{}'::jsonb,
  version         integer not null default 1,
  status          text not null default 'published',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint step_status_valid check (status in ('draft', 'published', 'archived'))
);

create table public.knowledge_check_questions (
  id           uuid primary key default gen_random_uuid(),
  step_id      uuid not null references public.steps(id) on delete cascade,
  position     integer not null default 0,
  question     text not null,
  options      jsonb not null,
  answer_index integer not null,
  created_at   timestamptz not null default now()
);

create table public.step_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  step_id      uuid not null references public.steps(id) on delete cascade,
  status       text not null default 'in_progress',
  best_score   numeric,
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  unique (user_id, step_id),
  constraint progress_status_valid check (
    status in ('in_progress', 'check_passed', 'signed_off')
  )
);

create table public.knowledge_check_attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  step_id    uuid not null references public.steps(id) on delete cascade,
  score      integer not null,
  total      integer not null,
  passed     boolean not null,
  answers    jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.commitments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  step_id     uuid not null references public.steps(id) on delete cascade,
  body        text not null,
  status      text not null default 'open',
  created_at  timestamptz not null default now(),
  resolved_at timestamptz,
  constraint commitment_status_valid check (status in ('open', 'kept', 'missed'))
);

create table public.manager_signoffs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  manager_id uuid references public.users(id) on delete set null,
  step_id    uuid not null references public.steps(id) on delete cascade,
  status     text not null default 'requested',
  criteria   jsonb not null default '[]'::jsonb,
  notes      text,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  constraint signoff_status_valid check (status in ('requested', 'approved', 'redo'))
);

create table public.coach_memories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  kind       text not null,
  content    text not null,
  source     text,
  created_at timestamptz not null default now(),
  constraint memory_kind_valid check (kind in ('struggle', 'strength', 'goal', 'fact'))
);

create table public.activity_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  kind       text not null,
  ref_type   text,
  ref_id     uuid,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================== INDEXES ==============================

create index idx_kcq_step_id            on public.knowledge_check_questions(step_id);
create index idx_step_progress_user     on public.step_progress(user_id);
create index idx_kc_attempts_user_step  on public.knowledge_check_attempts(user_id, step_id);
create index idx_commitments_user       on public.commitments(user_id);
create index idx_signoffs_user          on public.manager_signoffs(user_id);
create index idx_signoffs_manager       on public.manager_signoffs(manager_id);
create index idx_coach_memories_user    on public.coach_memories(user_id);
create index idx_activity_events_user   on public.activity_events(user_id, created_at);

-- ============================== TRIGGERS ==============================

create trigger steps_set_updated_at before update on public.steps
  for each row execute function public.set_updated_at();
create trigger step_progress_set_updated_at before update on public.step_progress
  for each row execute function public.set_updated_at();

-- ============================== RLS ==============================

alter table public.steps                     enable row level security;
alter table public.knowledge_check_questions enable row level security;
alter table public.step_progress             enable row level security;
alter table public.knowledge_check_attempts  enable row level security;
alter table public.commitments               enable row level security;
alter table public.manager_signoffs          enable row level security;
alter table public.coach_memories            enable row level security;
alter table public.activity_events           enable row level security;

-- Helper: is the requesting user a manager or owner in the same dealership as target user?
create or replace function public.current_user_manages(target_user uuid)
returns boolean as $$
  select exists (
    select 1
    from public.users me, public.users them
    where me.id = auth.uid()
      and them.id = target_user
      and me.role in ('owner', 'manager')
      and me.dealership_id is not null
      and me.dealership_id = them.dealership_id
  )
$$ language sql security definer stable;

-- STEPS + QUESTIONS: published master content readable by any authenticated user. Admin writes.
create policy "steps_select_published" on public.steps for select
  using (status = 'published' or public.current_user_is_admin());
create policy "steps_admin_all" on public.steps for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

create policy "kcq_select_authed" on public.knowledge_check_questions for select
  using (
    exists (
      select 1 from public.steps s
      where s.id = knowledge_check_questions.step_id
        and (s.status = 'published' or public.current_user_is_admin())
    )
  );
create policy "kcq_admin_all" on public.knowledge_check_questions for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- STEP PROGRESS: self all, manager read, admin all.
create policy "step_progress_self_all" on public.step_progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "step_progress_manager_read" on public.step_progress for select
  using (public.current_user_manages(user_id));
create policy "step_progress_admin_all" on public.step_progress for all
  using (public.current_user_is_admin()) with check (public.current_user_is_admin());

-- ATTEMPTS: self all, manager read, admin all.
create policy "kc_attempts_self_all" on public.knowledge_check_attempts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "kc_attempts_manager_read" on public.knowledge_check_attempts for select
  using (public.current_user_manages(user_id));
create policy "kc_attempts_admin_all" on public.knowledge_check_attempts for all
  using (public.current_user_is_admin()) with check (public.current_user_is_admin());

-- COMMITMENTS: self all, manager read, admin all.
create policy "commitments_self_all" on public.commitments for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "commitments_manager_read" on public.commitments for select
  using (public.current_user_manages(user_id));
create policy "commitments_admin_all" on public.commitments for all
  using (public.current_user_is_admin()) with check (public.current_user_is_admin());

-- SIGNOFFS: member creates a request for themselves and reads their own.
-- Managers read and decide for their dealership. Admin all.
create policy "signoffs_self_select" on public.manager_signoffs for select
  using (user_id = auth.uid());
create policy "signoffs_self_insert" on public.manager_signoffs for insert
  with check (user_id = auth.uid() and status = 'requested');
create policy "signoffs_manager_select" on public.manager_signoffs for select
  using (public.current_user_manages(user_id));
create policy "signoffs_manager_update" on public.manager_signoffs for update
  using (public.current_user_manages(user_id))
  with check (public.current_user_manages(user_id));
create policy "signoffs_admin_all" on public.manager_signoffs for all
  using (public.current_user_is_admin()) with check (public.current_user_is_admin());

-- COACH MEMORIES: strictly self plus admin. Managers do not read raw coach memory.
create policy "coach_memories_self_all" on public.coach_memories for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "coach_memories_admin_all" on public.coach_memories for all
  using (public.current_user_is_admin()) with check (public.current_user_is_admin());

-- ACTIVITY EVENTS: self insert and read, manager read, admin all.
create policy "activity_self_insert" on public.activity_events for insert
  with check (user_id = auth.uid());
create policy "activity_self_select" on public.activity_events for select
  using (user_id = auth.uid());
create policy "activity_manager_read" on public.activity_events for select
  using (public.current_user_manages(user_id));
create policy "activity_admin_all" on public.activity_events for all
  using (public.current_user_is_admin()) with check (public.current_user_is_admin());
