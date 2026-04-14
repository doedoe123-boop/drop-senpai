-- Phase 2B: Trusted organizers & author attribution

-- 1. New profile columns
alter table public.profiles
  add column if not exists is_verified_organizer boolean not null default false;

alter table public.profiles
  add column if not exists display_name text;

-- 2. Organizer helper function
create or replace function public.is_verified_organizer()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_verified_organizer = true
  );
$$;

-- 3. Replace item insert policy to allow organizer auto-approve
drop policy if exists "Authenticated users can insert pending items" on public.items;
drop policy if exists "Authenticated users can insert items" on public.items;

create policy "Authenticated users can insert items"
on public.items
for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and (
    status = 'pending'
    or (status = 'approved' and public.is_verified_organizer())
  )
);

-- 4. Relax profiles SELECT to allow author attribution
-- profiles contains only non-sensitive data (no email, no secrets)
drop policy if exists "Users can view own profile" on public.profiles;

create policy "Anyone can read profiles"
on public.profiles
for select
using (true);
