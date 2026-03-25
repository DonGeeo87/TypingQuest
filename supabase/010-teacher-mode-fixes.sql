alter table public.classes enable row level security;
alter table public.class_members enable row level security;

drop policy if exists "Members can view classes" on public.classes;
create policy "Members can view classes"
  on public.classes for select
  using (
    auth.uid() = teacher_id
    or exists (
      select 1 from public.class_members m
      where m.class_id = id and m.user_id = auth.uid()
    )
  );

drop policy if exists "Users can join classes" on public.class_members;
create policy "Users can join classes"
  on public.class_members for insert
  with check (
    auth.uid() = user_id
    and role = 'student'
  );

drop policy if exists "Teacher can add self as teacher" on public.class_members;
create policy "Teacher can add self as teacher"
  on public.class_members for insert
  with check (
    auth.uid() = user_id
    and role = 'teacher'
    and exists (
      select 1 from public.classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  );

