# Phase 2A — Community & Engagement

Lightweight community features: comments, reactions, reputation, and titles.

---

## 1. Schema Changes

### New tables

```
comments
├── id            uuid PK
├── item_id       uuid FK → items(id) ON DELETE CASCADE
├── user_id       uuid FK → profiles(id) ON DELETE CASCADE
├── body          text NOT NULL (max 1000 chars, enforced in app)
├── created_at    timestamptz NOT NULL DEFAULT now()

comment_likes
├── id            uuid PK
├── comment_id    uuid FK → comments(id) ON DELETE CASCADE
├── user_id       uuid FK → profiles(id) ON DELETE CASCADE
├── created_at    timestamptz NOT NULL DEFAULT now()
├── UNIQUE(comment_id, user_id)
```

### Altered tables

```
profiles
├── + reputation_points  integer NOT NULL DEFAULT 0
```

### Why this shape

- **comments** is flat (no `parent_id`) — no threading in Phase 2A, simpler queries.
- **comment_likes** is a separate join table (same pattern as `bookmarks`) — one like per user per comment, easy to count.
- **reputation_points** lives on `profiles` directly — avoids a separate table, easy to read, updated via DB triggers.
- No `item_likes` table yet — "optionally items later" stays out of scope for 2A.

### Indexes

```
comments(item_id, created_at DESC)   — feed query
comment_likes(comment_id)            — count query
comment_likes(user_id, comment_id)   — "did I like this" check (covered by unique)
profiles(reputation_points DESC)     — future leaderboard
```

### Reputation triggers

Two Postgres triggers handle points automatically:

| Event                              | Points |
| ---------------------------------- | ------ |
| Comment created                    | +2     |
| Comment deleted (own)              | -2     |
| Comment liked (author receives)    | +1     |
| Comment unliked (author loses)     | -1     |
| Item approved (submitter receives) | +5     |

The triggers call a single `adjust_reputation(user_id, delta)` function.

### RLS policies

```
comments SELECT   → anyone (attached to approved items only)
comments INSERT   → authenticated, user_id = auth.uid()
comments DELETE   → authenticated, user_id = auth.uid() OR is_admin()

comment_likes SELECT   → anyone
comment_likes INSERT   → authenticated, user_id = auth.uid()
comment_likes DELETE   → authenticated, user_id = auth.uid()

profiles.reputation_points → readable via existing profile SELECT policy
                           → not directly writable (trigger-only)
```

---

## 2. Title / Rank System

Computed client-side from `reputation_points`. No DB column needed.

```
Points     Title
──────     ─────
0-9        New Scout
10-29      Spotter
30-59      Insider
60-99      Drop Hunter
100+       Scene Operator
```

Implemented as a pure function in `packages/lib`:

```ts
function getReputationTitle(points: number): { title: string; tier: number };
```

Displayed in: profile summary, comment author line.

---

## 3. Types (`packages/types`)

### New file: `comments.ts`

```ts
export interface CommentRow {
  id: string;
  item_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

export interface CommentInsert {
  item_id: string;
  user_id: string;
  body: string;
}

export interface CommentLikeRow {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface CommentWithAuthor {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    username: string | null;
    avatarUrl: string | null;
    reputationPoints: number;
  };
  likeCount: number;
  likedByMe: boolean;
  isOwn: boolean;
}
```

### Updated: `database.ts`

- Add `reputation_points: number` to `ProfileRow`
- Add `comments` and `comment_likes` to `Database` interface

### Updated: `profiles.ts`

- Re-export updated `ProfileRow`

---

## 4. API Layer (`apps/mobile/src/features/comments/api/`)

### `comments.ts`

| Function                                | Description                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| `fetchComments(itemId, currentUserId?)` | SELECT comments + profiles join, newest first, with like counts and `likedByMe` |
| `createComment(itemId, userId, body)`   | INSERT into comments                                                            |
| `deleteComment(commentId)`              | DELETE from comments WHERE id                                                   |
| `likeComment(commentId, userId)`        | INSERT into comment_likes                                                       |
| `unlikeComment(commentId, userId)`      | DELETE from comment_likes                                                       |

`fetchComments` uses a single query with an embedded select:

```ts
supabase
  .from("comments")
  .select(
    "*, profiles!inner(id, username, avatar_url, reputation_points), comment_likes(id, user_id)",
  )
  .eq("item_id", itemId)
  .order("created_at", { ascending: false });
```

Then maps to `CommentWithAuthor[]` client-side, computing `likeCount`, `likedByMe`, and `isOwn`.

---

## 5. Hooks (`apps/mobile/src/features/comments/hooks/`)

| Hook                           | Type     | Notes                                     |
| ------------------------------ | -------- | ----------------------------------------- |
| `useItemComments(itemId)`      | query    | Returns `CommentWithAuthor[]`             |
| `useCreateComment(itemId)`     | mutation | Invalidates `itemComments` key on success |
| `useDeleteComment(itemId)`     | mutation | Invalidates `itemComments` key on success |
| `useToggleCommentLike(itemId)` | mutation | Optimistic update on like count           |

### New query keys

```ts
itemComments: (itemId: string) => ["item-comments", itemId] as const,
```

---

## 6. UI Components

### `apps/mobile/src/features/comments/components/`

| Component         | Description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `CommentSection`  | Container: header ("Comments"), comment list, input box. Used inside item detail.                |
| `CommentCard`     | Single comment bubble: author name + title badge, body, timestamp, like button, delete (if own). |
| `CommentInput`    | Text input + send button. Auth-gated (redirect to login if not signed in).                       |
| `ReputationBadge` | Small inline badge showing the user's title. Reused in profile too.                              |

### Updated screens

| Screen / Component  | Change                                                              |
| ------------------- | ------------------------------------------------------------------- |
| `ItemDetailContent` | Add `<CommentSection itemId={item.id} />` below the actions section |
| `ProfileSummary`    | Show reputation points + title via `<ReputationBadge />`            |
| `CommentCard`       | Show `<ReputationBadge />` next to author username                  |

### Design tokens (no new theme values needed)

- Comment cards: `surface` bg, `border` stroke, `radius.lg`
- Like button: `accent` color when active, `textMuted` when inactive
- Author name: `text` color, **bold**
- Body: `textSecondary`
- Title badge: `accent` bg at 15% opacity, `accent` text (same as featured badge pattern)
- Delete button: subtle `textMuted` trash icon, no background

---

## 7. Implementation Plan (sequential steps)

### Step 1 — Migration + types

- [ ] Write and apply migration SQL (tables, indexes, RLS, triggers)
- [ ] Update `packages/types/database.ts` — add `reputation_points` to `ProfileRow`, add new table types
- [ ] Create `packages/types/comments.ts` with row types + `CommentWithAuthor`
- [ ] Export from `packages/types/index.ts`
- [ ] Add `getReputationTitle()` to `packages/lib`

### Step 2 — API + hooks (comments only, no likes yet)

- [ ] Create `apps/mobile/src/features/comments/api/comments.ts`
- [ ] Create `useItemComments`, `useCreateComment`, `useDeleteComment` hooks
- [ ] Add `itemComments` to `query-keys.ts`

### Step 3 — Comment UI

- [ ] Build `CommentCard`, `CommentInput`, `CommentSection`
- [ ] Wire `CommentSection` into `ItemDetailContent`
- [ ] Test create + delete + empty state

### Step 4 — Likes

- [ ] Add `likeComment` / `unlikeComment` API functions
- [ ] Build `useToggleCommentLike` hook with optimistic update
- [ ] Add like button to `CommentCard`

### Step 5 — Reputation display

- [ ] Build `ReputationBadge` component
- [ ] Add to `ProfileSummary` (fetch profile with `reputation_points`)
- [ ] Add to `CommentCard` (data already in `CommentWithAuthor.author`)

### Step 6 — Admin visibility (optional, low effort)

- [ ] Show comment count on admin item detail
- [ ] Allow admin to delete any comment (already covered by RLS `is_admin()`)

---

## 8. Migration SQL

```sql
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
```

---

## 9. Risks & Tradeoffs

| Decision                        | Tradeoff                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| Flat comments (no threading)    | Simpler now; can add `parent_id` later without breaking schema                              |
| Reputation on `profiles` column | Fast reads; requires triggers (no manual writes)                                            |
| Client-side title computation   | Zero schema coupling; can change thresholds without migration                               |
| No `item_likes` yet             | Keeps scope small; easy to add same pattern as `comment_likes`                              |
| `security definer` on triggers  | Needed so trigger can update other users' reputation; safe because triggers are DB-internal |
| Like self-comment gives no rep  | Prevents easy self-farming                                                                  |
| No comment editing              | Keeps scope minimal; add in Phase 2B if needed                                              |
| No pagination (yet)             | Fine for MVP volumes; add cursor pagination when > 50 comments becomes common               |

---

## 10. File Manifest (new files to create)

```
supabase/migrations/20260414120000_phase2a_comments_reputation.sql
packages/types/src/comments.ts                    (new)
packages/types/src/database.ts                    (edit — ProfileRow, Database)
packages/types/src/index.ts                       (edit — export comments)
packages/lib/src/reputation.ts                    (new)
packages/lib/src/index.ts                         (edit — export reputation)
apps/mobile/src/constants/query-keys.ts           (edit — add itemComments key)
apps/mobile/src/features/comments/api/comments.ts (new)
apps/mobile/src/features/comments/hooks/use-item-comments.ts      (new)
apps/mobile/src/features/comments/hooks/use-create-comment.ts     (new)
apps/mobile/src/features/comments/hooks/use-delete-comment.ts     (new)
apps/mobile/src/features/comments/hooks/use-toggle-comment-like.ts (new)
apps/mobile/src/features/comments/components/comment-section.tsx   (new)
apps/mobile/src/features/comments/components/comment-card.tsx      (new)
apps/mobile/src/features/comments/components/comment-input.tsx     (new)
apps/mobile/src/features/comments/components/reputation-badge.tsx  (new)
apps/mobile/src/features/items/components/item-detail-content.tsx  (edit — add CommentSection)
apps/mobile/src/features/profile/components/profile-summary.tsx    (edit — add reputation display)
```

---

---

# Phase 2B — Trusted Organizers & Author Attribution

Verified organizer publishing and item-level author identity.

---

## Design Decision: Separate Field vs. Expanded Role

**Recommendation: Add a separate `is_verified_organizer` boolean to `profiles`.**

Why not expand `role`:

| Option                                                         | Problem                                                                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `role = 'user' \| 'admin' \| 'organizer'`                      | A user who is both admin AND organizer would need two roles. `role` is a single enum — you'd need a roles array or a second column anyway. |
| `role = 'user' \| 'admin' \| 'organizer' \| 'admin_organizer'` | Combinatorial explosion. Every RLS check and app-level `if` needs updating.                                                                |

A boolean `is_verified_organizer` is:

- **Independent of role** — admins can also be organizers; normal users can be organizers.
- **Simple to query** — `WHERE is_verified_organizer = true`.
- **Simple to grant/revoke** — single column update.
- **Zero impact on existing code** — nothing currently checks for a third role value; the `role` check constraint stays untouched.

### How auto-approval works safely

1. **RLS enforces it at the DB level.** The current insert policy requires `status = 'pending'`. We'll replace it with a policy that allows `status = 'approved'` **only if** the user has `is_verified_organizer = true`. Normal users can only insert `pending`.
2. **Client decides the status.** The mobile submit flow reads the profile's `is_verified_organizer` flag and sets `status = 'approved'` or `status = 'pending'` accordingly. Even if client code is wrong, RLS blocks a non-organizer from inserting `approved`.
3. **Admins can still moderate.** Approved organizer items remain editable/rejectable by admins — the existing admin update policy is unchanged.

### How author attribution is stored and displayed

- `items.submitted_by` already references `profiles.id` — no new FK needed.
- Queries join `profiles` on `submitted_by` to get `username`, `avatar_url`, `is_verified_organizer`, and `reputation_points`.
- The **display name** is `profiles.display_name` (new column) with fallback to `username` then to `"Anonymous"`.
- A `✓ Verified Organizer` badge renders next to the author name when `is_verified_organizer = true`.

### How admins manage organizer trust

- Admin panel gets a "Users" section (or inline in moderation) to toggle `is_verified_organizer`.
- Single Supabase `update` call — RLS already allows admins to update profiles.

---

## 1. Schema Changes

### Altered tables

```
profiles
├── + is_verified_organizer  boolean NOT NULL DEFAULT false
├── + display_name           text    (nullable — used as public name)
```

### Why `display_name`?

- `username` is currently auto-set to the email address by `ensureProfile`. It's an internal identifier.
- `display_name` is the public-facing name shown on items and comments ("Posted by Otaku Manila").
- Organizers set it via profile; regular users can optionally set it too.
- Fallback chain: `display_name` → `username` → `"Anonymous"`.

### Updated RLS: item insert policy

The current policy:

```sql
-- Only allows status = 'pending'
create policy "Authenticated users can insert pending items"
on public.items for insert to authenticated
with check (submitted_by = auth.uid() and status = 'pending');
```

Replaced with:

```sql
create policy "Authenticated users can insert items"
on public.items for insert to authenticated
with check (
  submitted_by = auth.uid()
  and (
    status = 'pending'
    or (
      status = 'approved'
      and public.is_verified_organizer()
    )
  )
);
```

### New helper function

```sql
create or replace function public.is_verified_organizer()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and is_verified_organizer = true
  );
$$;
```

### New RLS: profile public read for author attribution

Currently profiles are only readable by the owner or admin. We need public read of limited fields for author display. Options:

- **Option A:** Create a `profiles_public` view (id, display_name, username, avatar_url, is_verified_organizer, reputation_points) with open SELECT RLS. Cleanest — avoids leaking `role` or `email`.
- **Option B:** Relax the existing profile SELECT policy to allow anyone to read any profile.

**Recommendation: Option A (public view).** This keeps `profiles` locked down while exposing only the fields needed for attribution.

```sql
create or replace view public.profiles_public as
select
  id,
  display_name,
  username,
  avatar_url,
  is_verified_organizer,
  reputation_points
from public.profiles;
```

Since Supabase views inherit RLS of the underlying table by default, we set `security_invoker = false` (the view runs as definer) so the select bypasses profiles RLS. Alternatively, we just add a broader SELECT policy on profiles for the specific columns via a view.

**Simpler approach:** Just relax the profiles SELECT policy to allow any authenticated user to read any profile's non-sensitive fields. Since `profiles` doesn't store email (that's in `auth.users`), and `role` is not secret, this is safe:

```sql
-- Replace the owner-only read with public read
create policy "Anyone can read profiles"
on public.profiles for select
using (true);
```

This is safe because `profiles` contains only: `id`, `username`, `display_name`, `avatar_url`, `role`, `is_verified_organizer`, `reputation_points`, `created_at`. None of these are sensitive.

**Recommendation: Go with the relaxed SELECT policy.** It's simpler and the data is non-sensitive.

---

## 2. Types Changes

### `packages/types/src/database.ts`

```ts
// Updated ProfileRow
export interface ProfileRow {
  id: string;
  username: string | null;
  display_name: string | null; // NEW
  avatar_url: string | null;
  role: ProfileRole;
  is_verified_organizer: boolean; // NEW
  reputation_points: number; // from Phase 2A
  created_at: string;
}
```

### `packages/types/src/items.ts`

```ts
// Author info attached to items when joined
export interface ItemAuthor {
  id: string;
  displayName: string; // resolved from display_name → username → "Anonymous"
  avatarUrl: string | null;
  isVerifiedOrganizer: boolean;
  reputationPoints: number;
}

// Updated card model
export interface ItemCardModel {
  // ... existing fields ...
  author: ItemAuthor | null; // null when submitted_by is null (orphaned)
}
```

---

## 3. Affected Queries & Submission Logic

### Mobile: item fetching

All item queries that return cards/details need to join `profiles`:

```ts
// Before
supabase.from("items").select("*").eq("status", "approved");

// After
supabase
  .from("items")
  .select(
    "*, profiles:submitted_by(id, display_name, username, avatar_url, is_verified_organizer, reputation_points)",
  )
  .eq("status", "approved");
```

Affected functions:

- `fetchFeaturedItems()`
- `fetchUpcomingEvents()`
- `fetchLatestDrops()`
- `fetchApprovedItemsWithFilters()`
- `fetchApprovedItemById()`

All go through `mapItemRowToCardModel` / `mapItemRowToDetailModel` which will be updated to extract the author join.

### Mobile: submission flow

```ts
// Before (create-submission.ts)
const payload = { ...input, status: "pending" as const, ... };

// After
const status = isVerifiedOrganizer ? "approved" : "pending";
const payload = { ...input, status, ... };
```

The `useCreateSubmission` hook needs the user's `is_verified_organizer` status. The `AuthProvider` already stores the `user`, but not the profile. Options:

- Pass `isVerifiedOrganizer` from the profile fetch (already available if we add it to the auth context or a `useProfile` hook).
- Simplest: `useCreateSubmission` accepts an `isVerifiedOrganizer` param.

### Admin: moderation dashboard

Already joins `profiles:submitted_by(username)`. Extend to include `display_name` and `is_verified_organizer` for badge display.

### Admin: user management

New admin feature: list users, toggle `is_verified_organizer`. This is a new admin page.

---

## 4. UI Surfaces That Need Changes

### Mobile

| Surface             | Change                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `ItemCard`          | Show author line: "Posted by {displayName}" with optional ✓ badge                           |
| `ItemDetailContent` | Show author section below title with name, badge, avatar                                    |
| `SubmissionForm`    | Show "Will be published immediately" vs "Will be sent for review" based on organizer status |
| `ProfileSummary`    | Show `display_name` (editable), verified organizer badge if applicable                      |
| Profile edit (new)  | Allow users to set `display_name`                                                           |

### Admin

| Surface               | Change                                                |
| --------------------- | ----------------------------------------------------- |
| Moderation dashboard  | Show author name + organizer badge in item rows       |
| Review form           | Show author info                                      |
| User management (new) | List profiles, search, toggle `is_verified_organizer` |

---

## 5. Implementation Plan

### Step 1 — Migration + types

- [ ] Write migration: add `is_verified_organizer`, `display_name` to profiles
- [ ] Add `is_verified_organizer()` SQL function
- [ ] Replace item insert policy with organizer-aware version
- [ ] Relax profiles SELECT policy
- [ ] Update `ProfileRow` type with new fields
- [ ] Add `ItemAuthor` type
- [ ] Update `ItemCardModel` and `ItemDetailModel` with `author` field

### Step 2 — Author data in queries

- [ ] Update all item fetch functions to join `profiles:submitted_by`
- [ ] Update `mapItemRowToCardModel` to extract and map author
- [ ] Helper: `resolveDisplayName(displayName, username)` → string

### Step 3 — Author UI

- [ ] Add author line to `ItemCard` (compact: "by {name}" with optional ✓)
- [ ] Add author section to `ItemDetailContent` (avatar + name + badge)
- [ ] Build `VerifiedBadge` inline component

### Step 4 — Smart submission

- [ ] Add `is_verified_organizer` to auth context or profile hook
- [ ] Update `createPendingSubmission` → `createSubmission` (status based on organizer flag)
- [ ] Update `SubmissionForm` to show publish vs. review messaging
- [ ] Rename function/hook if needed for clarity

### Step 5 — Profile display name

- [ ] Add `display_name` field to `ProfileSummary`
- [ ] Build inline edit for display name (tap to edit, save on blur)
- [ ] Update `ensureProfile` to not overwrite `display_name`

### Step 6 — Admin user management

- [ ] New admin page: `/protected/users`
- [ ] List profiles with search
- [ ] Toggle `is_verified_organizer` per user
- [ ] Add nav link to admin layout

---

## 6. Migration SQL

```sql
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
```

---

## 7. Risks & Tradeoffs

| Decision                                          | Tradeoff                                                                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Boolean `is_verified_organizer` vs. expanded role | Boolean is independent and composable; doesn't break existing role checks                                              |
| `display_name` as separate column                 | Clean separation from `username` (which is email-derived); extra column but avoids overloading username                |
| Relaxed profiles SELECT                           | Exposes role/created_at publicly — acceptable since no PII is stored in profiles                                       |
| Client-side status decision                       | Client picks `approved` vs `pending`; RLS is the real gate. If client sends wrong status, RLS rejects the insert       |
| No dedicated organizer dashboard yet              | Organizers use the same submit flow; their items just skip moderation. Can add organizer-specific features in Phase 2C |
| No contact/messaging system                       | Author identity is visible; DMs/contact are out of scope. Users can click through to source URL for now                |

---

## 8. File Manifest

```
supabase/migrations/20260414130000_phase2b_organizers_attribution.sql  (new)
packages/types/src/database.ts        (edit — ProfileRow: display_name, is_verified_organizer)
packages/types/src/items.ts           (edit — ItemAuthor, update CardModel/DetailModel)
packages/lib/src/format/author.ts     (new — resolveDisplayName helper)
packages/lib/src/index.ts             (edit — export author utils)

apps/mobile/src/features/items/api/items.ts                  (edit — join profiles in all queries)
apps/mobile/src/features/items/components/item-card.tsx       (edit — author line)
apps/mobile/src/features/items/components/item-detail-content.tsx (edit — author section)
apps/mobile/src/features/submissions/api/create-submission.ts (edit — dynamic status)
apps/mobile/src/features/submissions/forms/submission-form.tsx (edit — publish/review messaging)
apps/mobile/src/features/submissions/hooks/use-create-submission.ts (edit — accept organizer flag)
apps/mobile/src/features/profile/components/profile-summary.tsx (edit — display name, organizer badge)
apps/mobile/src/features/profile/components/verified-badge.tsx  (new)

apps/admin/features/moderation/api.ts                (edit — join author in queries)
apps/admin/features/moderation/moderation-dashboard.tsx (edit — show author + badge)
apps/admin/features/users/                           (new directory)
apps/admin/features/users/api.ts                     (new — list/update profiles)
apps/admin/features/users/user-management.tsx         (new — user list + organizer toggle)
apps/admin/app/protected/users/page.tsx              (new — admin user page)
apps/admin/app/protected/layout.tsx                  (edit — add Users nav link)
```
