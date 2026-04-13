## Overview

This project is a mobile-first app for discovering, saving, and submitting anime and pop-culture events and merch drops in the Philippines.

Primary user value:
- discover events and drops in one place
- save items for later
- submit missing items
- trust each item because it includes a source link

The system is intentionally simple for MVP:
- mobile app for end users
- web admin panel for moderation
- Supabase as the shared backend

---

## High-level architecture

Mobile App (Expo React Native)
-> Supabase
   - Postgres
   - Auth
   - Storage
   - Row Level Security
-> Admin Web App (Next.js)

### Mobile app responsibilities
- browse approved items
- search and filter items
- save bookmarks
- submit new items
- manage basic profile

### Admin app responsibilities
- review pending submissions
- approve, reject, and edit items
- inspect source URLs
- manage duplicates
- optionally manage tags and categories later

### Supabase responsibilities
- store data in Postgres
- authenticate users and admins
- store uploaded images
- enforce access rules with RLS
- support future edge functions if needed

---

## Product architecture principles

1. Keep MVP simple.
2. Use one `items` table for both events and drops.
3. Require `source_url` for all submissions.
4. Do not depend on scraping or external APIs for MVP.
5. Treat moderation as a first-class feature.
6. Optimize for maintainability over abstraction.

---

## Why this architecture

### Why mobile-first
This product is meant for:
- quick browsing
- repeated checking
- saving things on the go
- future notification use

A mobile app fits the user behavior better than a desktop-first experience.

### Why Expo React Native
- fast setup
- cross-platform
- good for MVP velocity
- strong ecosystem
- easier iteration for solo development

### Why Supabase
- Postgres included
- Auth included
- Storage included
- RLS included
- fast setup for MVPs
- reduces backend boilerplate

### Why a separate admin web app
Moderation is much easier on desktop than on mobile.
The admin dashboard should be optimized for:
- reviewing submissions
- checking source links
- editing metadata
- spotting duplicates quickly

---

## Repository structure

Recommended structure:

/
- AGENTS.md
- README.md
- docs/
  - PRD.md
  - ARCHITECTURE.md
  - TASKS.md
- apps/
  - mobile/
  - admin/
- packages/
  - ui/
  - types/
  - lib/

### Structure notes

#### `apps/mobile`
Expo React Native app for end users.

#### `apps/admin`
Next.js admin dashboard for moderation.

#### `packages/ui`
Shared UI primitives if needed later.
Do not create this too early unless reuse becomes obvious.

#### `packages/types`
Shared TypeScript types for database models and API-safe data shapes.

#### `packages/lib`
Shared helpers such as:
- Supabase clients
- validation schemas
- formatting utilities

---

## Core domains

### 1. Items
An item is the main content unit shown in the app.

Types:
- `event`
- `drop`

An item should support:
- title
- description
- source URL
- image
- event/drop date
- location or shop metadata
- moderation status
- tags

### 2. Users
Users can:
- browse items
- save bookmarks
- submit items
- manage profile basics

Roles:
- `user`
- `admin`

### 3. Bookmarks
Users can save items for later viewing.

### 4. Moderation
Admins review submitted items before publication.

Moderation actions:
- approve
- reject
- edit
- mark duplicate

---

## Initial data model

### Table: `profiles`
Purpose:
Store user profile information and role.

Columns:
- `id` uuid primary key references auth.users.id
- `username` text nullable
- `avatar_url` text nullable
- `role` text not null default `user`
- `created_at` timestamptz not null default now()

Constraints:
- `role` must be `user` or `admin`

### Table: `items`
Purpose:
Store both events and drops in a single table.

Columns:
- `id` uuid primary key default gen_random_uuid()
- `type` text not null
- `title` text not null
- `description` text nullable
- `source_url` text not null
- `image_url` text nullable
- `event_date` timestamptz nullable
- `end_date` timestamptz nullable
- `location` text nullable
- `city` text nullable
- `region` text nullable
- `tags` text[] not null default '{}'
- `status` text not null default `pending`
- `submitted_by` uuid nullable references profiles(id) on delete set null
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Constraints:
- `type` must be `event` or `drop`
- `status` must be `pending`, `approved`, or `rejected`

Indexes:
- index on `status`
- index on `type`
- index on `event_date`
- gin index on `tags`

### Table: `bookmarks`
Purpose:
Store user saved items.

Columns:
- `id` uuid primary key default gen_random_uuid()
- `user_id` uuid not null references profiles(id) on delete cascade
- `item_id` uuid not null references items(id) on delete cascade
- `created_at` timestamptz not null default now()

Constraints:
- unique (`user_id`, `item_id`)

### Table: `submission_logs`
Purpose:
Track moderation actions.

Columns:
- `id` uuid primary key default gen_random_uuid()
- `item_id` uuid not null references items(id) on delete cascade
- `reviewed_by` uuid nullable references profiles(id) on delete set null
- `action` text not null
- `notes` text nullable
- `created_at` timestamptz not null default now()

Constraints:
- `action` must be `approved`, `rejected`, or `edited`

---

## Data lifecycle

### Browsing
1. mobile app requests approved items
2. Supabase returns rows where `status = approved`
3. app displays feed and detail screens

### Submission
1. user opens submit screen
2. user fills in form
3. app uploads image if provided
4. app inserts item with `status = pending`
5. admin reviews submission in admin app

### Moderation
1. admin opens pending queue
2. admin inspects item and source URL
3. admin approves, rejects, or edits
4. action is logged in `submission_logs`
5. approved items become visible in user app

### Bookmarking
1. user taps save
2. app inserts row into `bookmarks`
3. saved screen queries bookmarked items for that user

---

## API and data access approach

This project will primarily use Supabase client SDKs rather than a custom backend API for MVP.

### Mobile app
Use Supabase client for:
- auth
- read approved items
- create bookmarks
- create pending submissions
- fetch profile

### Admin app
Use Supabase client for:
- read pending items
- update item status
- edit item fields
- write moderation logs

### Future backend extensions
Only add server-side handlers or edge functions when necessary for:
- trusted admin workflows
- notifications
- automated ingestion
- rate limiting
- analytics jobs

---

## Authentication

### MVP auth
Use Supabase Auth.

Recommended login options:
- email magic link
- optional anonymous or guest browsing if easy to support

### Roles
Store role in `profiles.role`.

Role behavior:
- users can browse, bookmark, and submit
- admins can moderate and edit

---

## Authorization model

### Public
- can read approved items only

### Authenticated user
- can read approved items
- can create bookmarks for their own account
- can create submissions linked to their own account
- can read their own profile

### Admin
- can read and update all items
- can review pending items
- can write moderation logs

---

## Row Level Security strategy

Enable RLS on all app tables.

### `profiles`
- users can read their own profile
- users can update limited fields on their own profile
- admins can read profiles if needed

### `items`
- anyone can read rows where `status = approved`
- authenticated users can insert new rows with `status = pending`
- only admins can update status or edit arbitrary rows

### `bookmarks`
- users can read their own bookmarks
- users can insert their own bookmarks
- users can delete their own bookmarks

### `submission_logs`
- only admins can read and insert

---

## File storage

Use Supabase Storage for optional uploaded images.

### Storage rules
- submitted images should go into a controlled bucket
- public URLs are acceptable for MVP if content is safe
- if moderation becomes stricter later, uploaded files may need admin review before full publication

### Image handling
For MVP:
- support either image upload or image URL
- image is optional
- source URL remains required

---

## Search and filtering

### MVP approach
Use simple database queries:
- filter by `type`
- filter by `region`
- filter by `tags`
- sort by `event_date`
- keyword search by title later

### Future improvements
- full-text search
- ranking based on user interests
- personalized feeds

---

## State management approach

### Recommended libraries
- TanStack Query for server state
- Zustand for lightweight local UI state if needed
- React Hook Form for forms
- Zod for validation

### Guidelines
- keep server data in query hooks
- avoid global state for fetched lists unless necessary
- keep screen components thin
- move Supabase queries into dedicated modules or hooks

---

## Screen architecture

### Mobile app screens
- HomeScreen
- ExploreScreen
- ItemDetailScreen
- SavedScreen
- SubmitScreen
- ProfileScreen
- AuthScreen

### Admin app screens
- PendingItemsPage
- ApprovedItemsPage
- RejectedItemsPage
- ItemReviewPage
- AdminDashboardPage

---

## UI architecture

### Design principles
- dark mode friendly
- card-based layout
- bold event/drop badges
- clear dates
- obvious source link
- minimal clutter

### Shared component candidates
- ItemCard
- SectionHeader
- Badge
- EmptyState
- LoadingState
- ErrorState
- SourceLinkButton
- BookmarkButton
- SubmissionForm

---

## Error handling philosophy

MVP should include:
- loading states
- empty states
- retry states for failed fetches
- form validation errors
- friendly copy for network failures

Do not overbuild analytics or crash tooling in the first pass.

---

## Performance considerations

- paginate item feeds if needed
- cache simple queries in TanStack Query
- avoid loading large image lists without optimization
- select only required columns in list views
- use indexes on moderation and feed fields

---

## Content and legal guardrails

For MVP:
- do not build Facebook or Instagram scraping pipelines
- require source URLs for trust
- support manually seeded items and community submissions
- keep system ready for future ingestion without making it a dependency

The product should be able to function even if no automation exists yet.

---

## Future architecture extensions

Only add these after MVP validation:

### Notifications
- push notifications for saved tags or categories
- reminders for upcoming events

### Source ingestion
- ingestion workers
- official feeds and public websites
- dedupe pipeline
- source reliability scoring

### Organizer tools
- self-service event submissions
- shop dashboards
- featured placements

### Analytics
- popular items
- conversion to source links
- save rates
- submission rates

---

## Technical decisions to preserve

1. Keep one `items` table for MVP.
2. Keep moderation simple and explicit.
3. Use Supabase directly before introducing custom APIs.
4. Optimize for clean schema and clear types.
5. Prefer boring, maintainable architecture.

---

## Definition of a good MVP architecture

The architecture is good if:
- a solo developer can build it quickly
- users can browse and save without friction
- submissions are easy
- moderation is manageable
- database schema stays understandable
- future automation can be added without major rewrites