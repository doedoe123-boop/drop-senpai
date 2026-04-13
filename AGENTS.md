## Project

Anime & Pop Culture Events + Drops PH

## Mission

Build a clean, mobile-first discovery app for anime/pop-culture events and merch drops in the Philippines.

## Core rules

* Prioritize MVP simplicity over completeness.
* Prefer one reusable `items` model for events and drops unless there is a strong reason to split.
* Do not introduce scraping, payments, chat, comments, or AI features in MVP.
* Preserve a trustworthy source link for every item.
* Keep the UI fast, minimal, and card-based.
* Favor maintainable code over clever abstractions.

## Stack

* Expo React Native
* TypeScript
* Supabase
* Next.js admin panel

## Coding style

* Use TypeScript everywhere.
* Use small reusable components.
* Keep business logic out of screen components when possible.
* Prefer explicit names over short names.
* Add lightweight comments only where helpful.
* Avoid premature generic abstractions.

## Data rules

* `items.type` must be `event` or `drop`
* `items.status` must be `pending`, `approved`, or `rejected`
* `source_url` is required for all submitted items
* Admin moderation flow must stay simple

## UX rules

* Mobile-first
* Dark mode friendly
* Clear badges for event/drop
* Important actions must be visible without hunting
* Empty states and loading states are required

## Build order

1. schema and types
2. Supabase client
3. Home feed
4. Detail screen
5. Submit flow
6. Saved screen
7. Explore/search
8. Profile
9. Admin moderation panel

## Non-goals

* scraping pipeline
* comments
* social features
* AI summaries
* maps
* payments
* advanced push notifications

## When unsure

Choose the simpler implementation and explain the tradeoff.
