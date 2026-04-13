## Goal

Build the MVP of a mobile-first app for anime and pop-culture events and drops in the Philippines.

This file is the execution queue.
Prioritize simple, shippable work.

---

## Current status

Planning complete.
Next step is implementation scaffolding.

---

## Phase 1: Foundation

### 1. Set up repository structure
- create `apps/mobile`
- create `apps/admin`
- create `docs`
- add `AGENTS.md`
- add `PRD.md`
- add `ARCHITECTURE.md`
- add `TASKS.md`

### 2. Initialize mobile app
- create Expo React Native app with TypeScript
- configure linting and formatting
- install navigation dependencies
- install TanStack Query
- install React Hook Form
- install Zod
- install Supabase client

### 3. Initialize admin app
- create Next.js app with TypeScript
- configure linting and formatting
- install Supabase client
- set up simple route structure for moderation pages

### 4. Shared setup
- create shared environment variable template
- create shared TypeScript model definitions
- create Supabase client helpers for mobile and admin

---

## Phase 2: Database and auth

### 5. Create database schema
- create `profiles` table
- create `items` table
- create `bookmarks` table
- create `submission_logs` table
- add indexes
- add updated_at trigger if needed

### 6. Configure Supabase Auth
- enable email login or magic link
- create profile creation flow after signup
- define role model using `profiles.role`

### 7. Add RLS policies
- public can read approved items
- users can insert pending items
- users can manage their own bookmarks
- admins can moderate all items
- admins can read and write submission logs

---

## Phase 3: Mobile app MVP

### 8. Build navigation
- bottom tabs:
  - Home
  - Explore
  - Saved
  - Submit
  - Profile
- stack route for item details
- auth flow if needed

### 9. Build Home screen
- featured section
- upcoming events list
- latest drops list
- loading state
- empty state
- error state

### 10. Build Explore screen
- search UI
- type filters
- region filters
- tag filters
- reusable item list

### 11. Build Item Detail screen
- image
- title
- type badge
- date and location
- description
- source link button
- save button

### 12. Build Saved screen
- query user bookmarks
- show saved items list
- support empty state

### 13. Build Submit screen
- item type picker
- title input
- source URL input
- description input
- date input
- location input
- tags input
- optional image upload or image URL
- validation
- success state

### 14. Build Profile screen
- show basic account info
- sign in/sign out
- placeholder for my submissions
- placeholder for preferences if needed later

---

## Phase 4: Admin MVP

### 15. Build admin layout
- dashboard shell
- sidebar or top nav
- pending, approved, rejected views

### 16. Build pending moderation queue
- list pending items
- preview key metadata
- open item review page

### 17. Build item review page
- view submission details
- inspect source URL
- edit item fields
- approve
- reject
- save moderation log

### 18. Build approved and rejected views
- basic filtered lists
- edit actions
- quick status changes if useful

---

## Phase 5: Quality

### 19. Add loading and empty states
- all primary screens should handle:
  - loading
  - empty data
  - network errors

### 20. Add validation and safe UX
- validate submit form with Zod
- validate source URL
- require title, type, and source URL
- show inline error messages

### 21. Add reusable UI components
- ItemCard
- Badge
- SectionHeader
- EmptyState
- ErrorState
- SourceLinkButton
- BookmarkButton

### 22. Add basic seed or mock data mode
- support local mock data for UI development
- keep seed data minimal and realistic

---

## Phase 6: Launch preparation

### 23. Seed initial content
- add 20 to 30 approved items manually
- mix events and drops
- ensure each item has a real source link

### 24. QA critical flows
- browse feed
- view detail
- save bookmark
- submit item
- approve submission in admin
- verify approved item appears in mobile app

### 25. Prepare deployment
- configure environment variables
- deploy admin app
- configure Expo build setup
- test production Supabase project

---

## Non-goals

Do not work on these yet:
- scraping pipeline
- push notifications
- comments
- likes
- social profiles
- organizer dashboards
- affiliate systems
- payments
- AI summaries
- maps

---

## Immediate next actions

1. initialize Expo app
2. initialize Next.js admin app
3. create Supabase schema
4. define shared TypeScript types
5. build mobile navigation shell
6. build pending admin queue shell

---

## Definition of done for MVP

MVP is done when:
- users can browse approved items
- users can save bookmarks
- users can submit new items
- admins can review and approve submissions
- approved items show in the mobile app
- the app has basic loading, empty, and error states