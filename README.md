# Drop Senpai

Mobile-first MVP for discovering, saving, and submitting anime and pop-culture events and drops in the Philippines.

This repo currently contains:

- `apps/mobile`: Expo React Native user app
- `apps/admin`: Next.js admin panel
- `packages/types`: shared domain types
- `packages/lib`: shared validation and utility helpers
- `supabase/`: Supabase CLI config, migrations, and seed data

## Stack

- Expo React Native
- TypeScript
- Supabase
- Next.js
- pnpm workspaces

## MVP Scope Right Now

Implemented:

- mobile Home feed
- mobile item detail
- mobile submit flow
- optional mobile image upload to Supabase Storage
- mobile email magic-link auth
- session restore on app launch
- profile summary
- my submissions
- bookmarks
- mobile Explore search/filter
- admin moderation flow
- admin email + password auth
- duplicate moderation support
- rejection notes surfaced in My Submissions
- featured items backed by `items.featured`

Not implemented yet:

- notifications
- social features
- scraping

## Requirements

- Node.js 20+
- `pnpm` 9+
- a Supabase project

## Initial Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create environment variables

Create a local `.env` file from [.env.example](/var/www/drop-senpai/.env.example).

Required values:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use the same Supabase project for both mobile and admin unless you have a specific reason not to.
The repo scripts use `pnpm dlx supabase ...`, so a global Supabase CLI install is optional.

### 3. Use the Supabase CLI migration workflow

This repo now treats Supabase CLI migrations as the source of truth.

Important files:

- [supabase/config.toml](/var/www/drop-senpai/supabase/config.toml)
- [supabase/migrations/20260413094943_initial_schema.sql](/var/www/drop-senpai/supabase/migrations/20260413094943_initial_schema.sql)
- [supabase/migrations/20260413094944_rls_policies.sql](/var/www/drop-senpai/supabase/migrations/20260413094944_rls_policies.sql)
- [supabase/migrations/20260413095516_storage_item_images.sql](/var/www/drop-senpai/supabase/migrations/20260413095516_storage_item_images.sql)
- [supabase/migrations/20260413120000_add_featured_column.sql](/var/www/drop-senpai/supabase/migrations/20260413120000_add_featured_column.sql)
- [supabase/migrations/20260414110000_stabilize_featured_storage_and_submission_logs.sql](/var/www/drop-senpai/supabase/migrations/20260414110000_stabilize_featured_storage_and_submission_logs.sql)
- [supabase/seed.sql](/var/www/drop-senpai/supabase/seed.sql)

For local development:

```bash
pnpm db:reset
```

For a remote Supabase project:

```bash
pnpm dlx supabase link --project-ref <your-project-ref>
pnpm db:push
```

### 4. Configure Supabase Auth

Enable email auth in Supabase.

For the mobile app:

- keep email OTP / magic link enabled

For the admin app:

- enable email + password sign-in
- create admin accounts in Supabase Auth
- set the matching `public.profiles.role` to `admin`

Add these redirect URLs:

```text
dropsenpai://auth/callback
http://localhost:3000
```

Without those redirect URLs, mobile magic-link sign-in will not return correctly.

## Running the Apps

### Mobile

```bash
pnpm dev:mobile
```

### Admin

```bash
pnpm dev:admin
```

## Useful Commands

Workspace checks:

```bash
pnpm db:status
pnpm typecheck
pnpm lint
```

App-specific checks:

```bash
pnpm --filter mobile typecheck
pnpm --filter admin typecheck
pnpm --filter admin build
```

Supabase workflow:

```bash
pnpm db:new add_some_change
pnpm db:reset
pnpm db:push
```

## Before Pushing

Run these commands before pushing:

```bash
pnpm db:status
pnpm typecheck
pnpm lint
pnpm --filter admin build
```

Also verify manually:

- mobile Home feed loads approved seeded items
- featured seeded items appear in the `Featured` section
- mobile Detail screen opens from Home
- Explore search and filters return expected approved items
- mobile sign-in email link works with your Supabase redirect config
- signed-in users can submit an item with or without an uploaded image
- signed-in users can save and remove bookmarks
- My Submissions shows the signed-in user's items, statuses, and rejection notes when applicable
- admin can review, approve, reject, or mark duplicates for pending items
- admin email/password sign-in persists across refresh

## Auth and Ownership Notes

- Home and Detail are public
- Submit, Saved, Profile, and My Submissions require auth
- new submissions are inserted with `status = 'pending'`
- authenticated submissions must use `submitted_by = auth.uid()`
- bookmarks are owned by `bookmarks.user_id = auth.uid()`
- admin routes require an authenticated user with `profiles.role = 'admin'`
- item images are stored in `item-images/<user-id>/...`
- authenticated users can only manage their own uploaded images unless they are admins
- users can read moderation logs for items they personally submitted

Profile rows are created automatically on first successful sign-in by the mobile and admin clients.
Admin accounts still authenticate through `auth.users`; authorization continues to come from `public.profiles.role`.

## Database Notes

The MVP keeps a single `items` table for both events and drops.

Core tables:

- `profiles`
- `items`
- `bookmarks`
- `submission_logs`

Important rules:

- `items.type` is `event` or `drop`
- `items.status` is `pending`, `approved`, or `rejected`
- `source_url` is required
- `items.featured` controls the Home `Featured` section
- `duplicate_of_item_id` links duplicate submissions to a canonical item

## Supabase Migration Workflow

Create a new migration:

```bash
pnpm db:new add_some_change
```

Then edit the generated SQL file in `supabase/migrations/`.

Apply migrations locally:

```bash
pnpm db:reset
```

Push unapplied migrations to a linked remote project:

```bash
pnpm db:push
```

Inspect migration state:

```bash
pnpm db:status
```

## Repo Notes

- Follow [AGENTS.md](/var/www/drop-senpai/AGENTS.md) for project rules and build order
- Source-of-truth product docs live in `docs/`
- Do not add scraping, AI features, comments, payments, or social features in the MVP

## Troubleshooting

If the mobile app cannot load data:

- check `.env` values
- confirm the local database was reset or remote migrations were pushed
- confirm seed data exists
- confirm the anon key belongs to the same Supabase project

If featured items do not appear:

- confirm at least one approved item has `featured = true`
- confirm the newest migrations were applied
- confirm the seeded data was reloaded after the featured migration

If magic-link auth does not complete:

- confirm email auth is enabled in Supabase
- confirm `dropsenpai://auth/callback` is in allowed redirect URLs
- open the email link on the same device or browser session running the app

If admin login does not work:

- confirm the Email provider and password sign-in are enabled in Supabase
- confirm the admin account exists in Supabase Auth
- confirm the account has a matching `public.profiles` row
- confirm `public.profiles.role = 'admin'`

If admin login does not work:

- confirm the Email provider and password sign-in are enabled in Supabase
- confirm the admin account exists in Supabase Auth
- confirm a matching row exists in `public.profiles`
- confirm `public.profiles.role = 'admin'`
