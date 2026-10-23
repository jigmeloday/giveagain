---
name: giveagain-database
description: PostgreSQL schema, migration, constraint, index and seed rules for GiveAgain. Use whenever creating or changing tables, columns, indexes, migrations, seed data, or writing SQL queries.
---

# GiveAgain database

PostgreSQL via `pg`. Auth tables come from Better Auth. Query design and speed are in `giveagain-backend`; security in `giveagain-security`.

## Principles

- **The database enforces the rules**, not only the code: `NOT NULL`, `CHECK`, foreign keys, unique and partial unique indexes. Code can have bugs; constraints don't.
- Schema changes happen **only through migrations**, committed to git, never by hand in a shared database.
- Keep it boring and normalized. No JSON blobs for things we filter on.

## Better Auth tables

- Generate and migrate Better Auth's own tables with its CLI for the installed version; check its docs. **Do not hand-edit them.**
- Add our fields (e.g. `role`, `phone`, `suspended_at`) through Better Auth's `additionalFields` config, with `role` marked non-writable by clients.
- Our tables reference the auth user's id with a foreign key (check its type, usually text).

## Conventions

- Tables and columns `snake_case`, tables singular or plural but **consistent** (pick one and keep it).
- Every table: primary key `id`, `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz NOT NULL DEFAULT now()` (set by trigger or code).
- Use `timestamptz` for all times; store UTC.
- Enums as Postgres enums or `text` + `CHECK (col IN (...))`; the allowed values mirror the constants in code (status, category, condition, dzongkhag).
- Foreign keys with explicit `ON DELETE` behavior (`CASCADE` for photos, `RESTRICT` where history matters). Prefer **soft delete** (`deleted_at`) for listings and users so reports and audit trails survive.
- Phone stored in E.164 only (see `giveagain-security`).

## Core tables (starting design)

- `listing`: `id`, `owner_id` → user, `title`, `description`, `category`, `condition`, `dzongkhag`, `area`, `address_private` (exact address, never in public DTOs), `status` (`pending|available|reserved|given|rejected|withdrawn`), `rejection_reason`, `moderated_by`, `moderated_at`, `deleted_at`.
- `listing_photo`: `id`, `listing_id`, `url`/`key`, `position`, `width`, `height`.
- `booking`: `id`, `listing_id`, `requester_id`, `phone` (E.164), `note`, `status` (`requested|accepted|declined|cancelled`).
- `report`: `id`, `reporter_id`, `target_type` (`listing|user`), `target_id`, `reason`, `details`, `status` (`open|actioned|dismissed`), `resolved_by`, `resolved_at`.
- `audit_log`: `id`, `actor_id`, `action`, `target_type`, `target_id`, `reason`, `meta`, `created_at`. **Append-only**: the app role has no `UPDATE`/`DELETE` on it.

Adjust as the product evolves, but keep rules like these in constraints.

## Constraints that protect the business rules

- One booking per user per listing: `UNIQUE (listing_id, requester_id)` (partial, excluding `cancelled`, if re-booking is allowed).
- Only one accepted booking per listing: `UNIQUE (listing_id) WHERE status = 'accepted'`.
- A user cannot book their own listing: enforce in service (and a trigger/`CHECK` if feasible).
- One report per reporter per target: `UNIQUE (reporter_id, target_type, target_id)`.
- Status columns have `CHECK` constraints; transitions are validated in the service.

## Indexes

- Listing browse: `(status, created_at DESC, id)`; filters: `(dzongkhag, status)`, `(category, status)`; owner: `(owner_id)`.
- Booking: `(listing_id)`, `(requester_id)`. Report: `(status, created_at)`, `(target_type, target_id)`.
- Use partial indexes for hot paths (`WHERE status = 'available' AND deleted_at IS NULL`).
- Add an index only for a real query; verify with `EXPLAIN ANALYZE`.

## Migrations

- One tool, plain SQL migration files, sequential and timestamped, committed (recommended: `node-pg-migrate`; confirm with the user before adding).
- Migrations are **forward-only and small**; never edit one that has been applied. Fix with a new migration.
- Safe changes for live data: add nullable column → backfill → add constraint; create indexes `CONCURRENTLY`; avoid long locks.
- Migrations run with a separate privileged credential; the app uses a least-privilege role.
- Every migration is tested: apply to an empty test DB and to a seeded one.

## Seed data

- `seed:dev` creates admin, two normal users and sample listings in each status with placeholder photos, for development and tests. **Never** run seeds against production; the first production admin is created by a one-off script.
- No real personal data in seeds.

## Queries

- Parameterized only, explicit columns, joins instead of loops, cursor pagination (see `giveagain-backend`).
- Keep SQL in one `queries/<domain>.ts` file per domain, small functions, typed results.
- Review changes for backup/restore impact; test that a restore works.
