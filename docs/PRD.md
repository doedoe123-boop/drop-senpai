You are helping me plan and scaffold an MVP mobile app.

# Project

Anime & Pop Culture Events + Drops PH

# Product goal

Build a mobile-first app for users in the Philippines to discover, save, and submit:

* anime conventions
* cosplay events
* local pop-culture gigs
* figure / merch / TCG drops
* shop restocks
* community-submitted event announcements

The app should feel curated, fast, and cleaner than discovering everything through scattered Facebook posts, shop pages, and random social links.

# Primary problem

Users miss events and drops because information is fragmented and hard to track.

# Product principles

* mobile-first
* fast scanning
* clean cards
* trustworthy source links
* low-friction submission flow
* simple moderation
* no bloated social features in MVP

# MVP scope

Build only these user-facing features:

1. Home feed

   * featured section
   * upcoming events
   * latest drops
   * featured items are explicitly curated via admin moderation

2. Explore

   * search
   * filter by type, location, tags

3. Detail screen

   * image
   * title
   * type
   * date/time
   * location or shop
   * description
   * source link
   * save button

4. Saved screen

   * saved events
   * saved drops

5. Submit screen

   * submit an event or drop
   * require source link
   * optional image upload
   * pending review state

6. Auth

   * email login or magic link
   * guest browsing is okay if easy to support

7. Profile

   * basic account info
   * my submissions
   * submission status feedback
   * latest rejection note when applicable
   * preferences later if needed

# Admin MVP

Build a simple admin web interface for moderation:

* view pending submissions
* approve / reject / edit
* inspect source link
* mark duplicates using an existing approved item
* optionally mark items as featured

# Non-goals for MVP

Do NOT build:

* chat
* comments
* social feed
* likes/upvotes
* AI summarizer
* maps
* advanced notifications
* organizer dashboards
* scraping pipeline
* affiliate system
* payments

# Tech stack

Preferred stack:

* React Native with Expo
* TypeScript
* Supabase
* PostgreSQL via Supabase
* Supabase Auth
* Supabase Storage
* simple Next.js admin panel for moderation

# Architecture

* mobile app for users
* web admin panel for moderation
* shared Supabase backend

# Data model

Start simple.

## users

* id
* username
* avatar_url
* role (`user`, `admin`)
* created_at

## items

Single table for both events and drops:

* id
* type (`event`, `drop`)
* title
* description
* source_url
* image_url
* event_date
* end_date nullable
* location
* city
* region
* tags
* status (`pending`, `approved`, `rejected`)
* submitted_by
* created_at
* updated_at

## bookmarks

* id
* user_id
* item_id
* created_at

## submission_logs (optional if useful)

* id
* item_id
* reviewed_by
* action
* notes
* created_at

In the current MVP, `submission_logs` are in use and power submitter feedback such as rejection notes.

# Content/source rules

Important:

* This app should NOT depend on scraping Facebook or Instagram as the MVP foundation.
* Design the product so it can work first with manually seeded items + community submissions + official public source links.
* Every item should have a source link for trust.
* Keep the schema and code ready for future ingestion pipelines, but do not implement scraping yet.

# UX direction

Style:

* dark-mode friendly
* anime-inspired but not noisy
* simple bold event/drop badges
* clean cards
* large readable dates
* mobile-first layout

Navigation:

* Home
* Explore
* Saved
* Submit
* Profile

# Suggested screen order

1. Home
2. Detail
3. Submit
4. Saved
5. Explore
6. Profile
7. Admin dashboard

# What I want from you

Please help me in this order:

## Phase 1: Planning output

Produce:

1. recommended folder structure
2. route/screen map
3. component list
4. Supabase schema SQL
5. TypeScript types
6. state/data-fetching approach
7. admin panel structure
8. MVP milestone breakdown

## Phase 2: Scaffold

Then generate:

1. Expo app scaffold
2. shared UI component structure
3. Supabase client setup
4. starter screens
5. mock data fallback
6. Next.js admin scaffold

## Phase 3: Quality

Then add:

1. form validation
2. empty states
3. loading states
4. basic error handling
5. RLS policy suggestions
6. environment variable template

# Constraints

* optimize for simplicity and speed
* avoid overengineering
* keep codebase beginner-friendly but production-aware
* use clear file names and predictable structure
* explain tradeoffs when making decisions

# First task

Start by giving me:

1. the final proposed project structure
2. the database schema SQL
3. the screen map
4. the first milestone plan for week 1
