alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.bookmarks enable row level security;
alter table public.submission_logs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Public can read approved items" on public.items;
create policy "Public can read approved items"
on public.items
for select
using (status = 'approved' or public.is_admin());

drop policy if exists "Anyone can insert pending items" on public.items;
drop policy if exists "Authenticated users can insert pending items" on public.items;
create policy "Authenticated users can insert pending items"
on public.items
for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and status = 'pending'
);

drop policy if exists "Users can view own submitted items" on public.items;
create policy "Users can view own submitted items"
on public.items
for select
to authenticated
using (submitted_by = auth.uid() or public.is_admin());

drop policy if exists "Admins can update items" on public.items;
create policy "Admins can update items"
on public.items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Users can manage own bookmarks" on public.bookmarks;
create policy "Users can manage own bookmarks"
on public.bookmarks
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins can read submission logs" on public.submission_logs;
create policy "Admins can read submission logs"
on public.submission_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert submission logs" on public.submission_logs;
create policy "Admins can insert submission logs"
on public.submission_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update submission logs" on public.submission_logs;
create policy "Admins can update submission logs"
on public.submission_logs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

