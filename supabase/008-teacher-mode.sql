create table if not exists public.classes (
  id uuid primary key default extensions.uuid_generate_v4(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  code text unique not null,
  created_at timestamptz not null default now()
);

create index if not exists classes_teacher_id_idx on public.classes(teacher_id);

create table if not exists public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'student' check (role in ('teacher','student')),
  joined_at timestamptz not null default now(),
  primary key (class_id, user_id)
);

create index if not exists class_members_user_id_idx on public.class_members(user_id);

create table if not exists public.assignments (
  id uuid primary key default extensions.uuid_generate_v4(),
  class_id uuid not null references public.classes(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  language text not null default 'en' check (language in ('en','es')),
  level integer not null default 1 check (level between 1 and 5),
  duration_seconds integer not null default 60 check (duration_seconds in (30,60,90,120)),
  mode text not null default 'classic' check (mode in ('classic')),
  due_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists assignments_class_id_idx on public.assignments(class_id);

create table if not exists public.assignment_attempts (
  id uuid primary key default extensions.uuid_generate_v4(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_result_id uuid references public.game_results(id) on delete set null,
  wpm integer not null,
  accuracy numeric not null,
  errors integer not null default 0,
  words_completed integer not null default 0,
  score integer not null default 0,
  submitted_at timestamptz not null default now()
);

create index if not exists assignment_attempts_assignment_idx on public.assignment_attempts(assignment_id);
create index if not exists assignment_attempts_user_idx on public.assignment_attempts(user_id);

alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_attempts enable row level security;

drop policy if exists "Members can view classes" on public.classes;
create policy "Members can view classes"
  on public.classes for select
  using (
    exists (
      select 1 from public.class_members m
      where m.class_id = id and m.user_id = auth.uid()
    )
  );

drop policy if exists "Teacher can manage classes" on public.classes;
create policy "Teacher can manage classes"
  on public.classes for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

drop policy if exists "Members can view class members" on public.class_members;
create policy "Members can view class members"
  on public.class_members for select
  using (
    exists (
      select 1 from public.class_members m
      where m.class_id = class_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "Users can join classes" on public.class_members;
create policy "Users can join classes"
  on public.class_members for insert
  with check (
    auth.uid() = user_id
    and role = 'student'
  );

drop policy if exists "Teacher can manage class members" on public.class_members;
create policy "Teacher can manage class members"
  on public.class_members for update
  using (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
  );

drop policy if exists "Members can view assignments" on public.assignments;
create policy "Members can view assignments"
  on public.assignments for select
  using (
    exists (
      select 1 from public.class_members m
      where m.class_id = class_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "Teacher can manage assignments" on public.assignments;
create policy "Teacher can manage assignments"
  on public.assignments for all
  using (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
  )
  with check (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
  );

drop policy if exists "Members can view attempts" on public.assignment_attempts;
create policy "Members can view attempts"
  on public.assignment_attempts for select
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.assignments a
      join public.classes c on c.id = a.class_id
      where a.id = assignment_id and c.teacher_id = auth.uid()
    )
  );

drop policy if exists "Students can submit attempts" on public.assignment_attempts;
create policy "Students can submit attempts"
  on public.assignment_attempts for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.assignments a
      join public.class_members m on m.class_id = a.class_id and m.user_id = auth.uid()
      where a.id = assignment_id and a.is_active = true
    )
  );

grant select on public.classes to authenticated;
grant select on public.class_members to authenticated;
grant select on public.assignments to authenticated;
grant select on public.assignment_attempts to authenticated;
grant insert on public.class_members to authenticated;
grant insert on public.assignment_attempts to authenticated;
grant insert, update, delete on public.classes to authenticated;
grant insert, update, delete on public.assignments to authenticated;
grant update on public.class_members to authenticated;

