create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('event', 'drop')),
  title text not null,
  description text,
  source_url text not null,
  image_url text,
  event_date timestamptz,
  end_date timestamptz,
  location text,
  city text,
  region text,
  tags text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_by uuid references public.profiles (id) on delete set null,
  duplicate_of_item_id uuid references public.items (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id uuid not null references public.items (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint bookmarks_user_id_item_id_key unique (user_id, item_id)
);

create table if not exists public.submission_logs (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  reviewed_by uuid references public.profiles (id) on delete set null,
  action text not null check (action in ('approved', 'rejected', 'edited')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists items_status_idx on public.items (status);
create index if not exists items_type_idx on public.items (type);
create index if not exists items_event_date_idx on public.items (event_date desc);
create index if not exists items_region_idx on public.items (region);
create index if not exists items_tags_gin_idx on public.items using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_set_updated_at on public.items;

create trigger items_set_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

