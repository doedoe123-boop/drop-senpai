alter table public.items
  add column if not exists featured boolean not null default false;

create index if not exists items_featured_idx on public.items (featured) where featured = true;
