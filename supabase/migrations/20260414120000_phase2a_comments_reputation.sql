-- Phase 2A: Comments, reactions, reputation

-- 1. Add reputation to profiles
alter table public.profiles
  add column if not exists reputation_points integer not null default 0;

create index if not exists profiles_reputation_idx
  on public.profiles (reputation_points desc);

-- 2. Comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_item_created_idx
  on public.comments (item_id, created_at desc);

-- 3. Comment likes table
create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint comment_likes_user_comment_key unique (comment_id, user_id)
);

create index if not exists comment_likes_comment_idx
  on public.comment_likes (comment_id);

-- 4. Reputation helper
create or replace function public.adjust_reputation(target_user_id uuid, delta integer)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set reputation_points = greatest(0, reputation_points + delta)
  where id = target_user_id;
end;
$$;

-- 5. Triggers: comment reputation
create or replace function public.on_comment_insert()
returns trigger language plpgsql security definer as $$
begin
  perform public.adjust_reputation(new.user_id, 2);
  return new;
end;
$$;

create or replace function public.on_comment_delete()
returns trigger language plpgsql security definer as $$
begin
  perform public.adjust_reputation(old.user_id, -2);
  return old;
end;
$$;

drop trigger if exists comments_reputation_insert on public.comments;
create trigger comments_reputation_insert
after insert on public.comments
for each row execute function public.on_comment_insert();

drop trigger if exists comments_reputation_delete on public.comments;
create trigger comments_reputation_delete
after delete on public.comments
for each row execute function public.on_comment_delete();

-- 6. Triggers: like reputation (award to comment author)
create or replace function public.on_comment_like_insert()
returns trigger language plpgsql security definer as $$
declare
  comment_author_id uuid;
begin
  select user_id into comment_author_id
  from public.comments where id = new.comment_id;

  if comment_author_id is not null and comment_author_id <> new.user_id then
    perform public.adjust_reputation(comment_author_id, 1);
  end if;

  return new;
end;
$$;

create or replace function public.on_comment_like_delete()
returns trigger language plpgsql security definer as $$
declare
  comment_author_id uuid;
begin
  select user_id into comment_author_id
  from public.comments where id = old.comment_id;

  if comment_author_id is not null and comment_author_id <> old.user_id then
    perform public.adjust_reputation(comment_author_id, -1);
  end if;

  return old;
end;
$$;

drop trigger if exists comment_likes_reputation_insert on public.comment_likes;
create trigger comment_likes_reputation_insert
after insert on public.comment_likes
for each row execute function public.on_comment_like_insert();

drop trigger if exists comment_likes_reputation_delete on public.comment_likes;
create trigger comment_likes_reputation_delete
after delete on public.comment_likes
for each row execute function public.on_comment_like_delete();

-- 7. Trigger: item approval reputation (award to submitter)
create or replace function public.on_item_approved()
returns trigger language plpgsql security definer as $$
begin
  if old.status <> 'approved' and new.status = 'approved' and new.submitted_by is not null then
    perform public.adjust_reputation(new.submitted_by, 5);
  end if;

  if old.status = 'approved' and new.status <> 'approved' and new.submitted_by is not null then
    perform public.adjust_reputation(new.submitted_by, -5);
  end if;

  return new;
end;
$$;

drop trigger if exists items_approval_reputation on public.items;
create trigger items_approval_reputation
after update on public.items
for each row execute function public.on_item_approved();

-- 8. RLS
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;

-- Comments: anyone can read on approved items
create policy "Anyone can read comments on approved items"
on public.comments for select
using (
  exists (
    select 1 from public.items
    where items.id = comments.item_id
      and (items.status = 'approved' or public.is_admin())
  )
);

-- Comments: authenticated can insert own
create policy "Authenticated users can create comments"
on public.comments for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.items
    where items.id = comments.item_id
      and items.status = 'approved'
  )
);

-- Comments: own or admin can delete
create policy "Users can delete own comments"
on public.comments for delete
to authenticated
using (user_id = auth.uid() or public.is_admin());

-- Comment likes: anyone can read
create policy "Anyone can read comment likes"
on public.comment_likes for select
using (true);

-- Comment likes: authenticated can insert own
create policy "Authenticated users can like comments"
on public.comment_likes for insert
to authenticated
with check (user_id = auth.uid());

-- Comment likes: authenticated can unlike own
create policy "Users can remove own likes"
on public.comment_likes for delete
to authenticated
using (user_id = auth.uid());
