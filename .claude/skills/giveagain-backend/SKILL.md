---
name: giveagain-backend
description: Backend architecture rules for GiveAgain: shared tRPC procedures (one API for user and admin where possible), simple fast queries, small payloads for slow networks, pagination, indexes, caching. Use whenever designing or writing tRPC routers, services, SQL queries, or any API/data-fetching code.
---

# GiveAgain backend design

Stack: tRPC + PostgreSQL (`pg`) + Better Auth. Security bar and mandatory tests are in `giveagain-security` (always apply it too: **security comes first, speed second, cleverness never**). Product rules are in `giveagain`.

## 1. One API, not two

Do not build `listing.*` and `adminListing.*` as separate copies. If the data and logic are the same and only the *permission or visibility* differs, keep **one procedure** and let the caller's role decide.

- One router per domain: `listing`, `booking`, `report`, `user`. Admin-only actions that don't exist for normal users (approve, reject, suspend) are extra procedures in the same router, built with `adminProcedure`.
- Shared read procedures (`listing.list`, `listing.get`) apply visibility **on the server from `ctx`**:
  - anonymous → approved listings only
  - signed-in user → approved + their own (any status)
  - admin → everything, and may use an extra `status` filter
- The role is **never** taken from the input. Admin-only filters/fields are ignored or rejected for non-admins (validate, don't silently trust).
- Response shape may gain admin-only fields for admins (e.g. moderation notes, report count); build it in one mapper function (`toListingDto(row, viewer)`), so no field leaks by accident and tests cover each viewer type.
- Only split into separate procedures when behavior truly differs (different inputs, different rules), not just to hide a button.
- Admin pages are just another UI calling the same procedures.

## 2. Keep it simple

- Layers: **router** (input schema + auth tier + call) → **service** function (business logic, one file per domain) → **query** (SQL). Routers stay thin.
- Plain SQL with parameters; a few readable queries beat clever abstractions. No dynamic query-builders unless truly needed. No deep inheritance, generic repositories, or magic.
- One procedure does one job and returns what the screen needs. Avoid "god" endpoints with many optional modes.
- Each backend file under ~150 lines, same as the frontend; split by domain/responsibility.
- Business rules live in the service layer (e.g. state transitions in one `canTransition(from, to)` table), not scattered in routers or the UI.

## 3. Fast, even on a slow network

Many users are on mobile with weak, high-latency connections. Optimize for **few requests, small responses, quick queries**.

**Payloads**
- Return only needed fields. List responses use a **card shape** (id, name, thumbnail URL, area, condition, createdAt, status), not the full listing. Detail is a separate `get`.
- Never return big blobs, base64 images or raw rows. Images are URLs, with a small thumbnail for lists.
- Enable compression (gzip/brotli) at the host/CDN.

**Requests**
- Fewer round trips: one query for a screen where sensible (e.g. `listing.get` includes photos and the viewer's booking state) instead of 4 calls. Use tRPC request batching (`httpBatchLink`) for the rest.
- Paginate every list with **cursor pagination** (`createdAt,id`), default 12–20, hard max 50. Never `OFFSET` on big tables, never unbounded.
- Search/filter on the server, with debounced input on the client.

**Database**
- Index what you filter and sort on: `(status, created_at DESC, id)`, `(dzongkhag, status)`, `(category, status)`, `owner_id`, booking `(listing_id)` and `(user_id)`, unique constraints that double as indexes. Use partial indexes for hot queries (e.g. `WHERE status = 'available'`). Check slow queries with `EXPLAIN ANALYZE`.
- No N+1: fetch related rows with a join or one `WHERE id = ANY($1)` query, never a query per item in a loop.
- Use a connection pool, sized sensibly, reuse it (singleton). Use the pooled connection string on serverless.
- Keep transactions short; no network calls or slow work inside them.
- Full-text search with Postgres (`tsvector` + GIN, or `pg_trgm`) when search is added; don't scan with `ILIKE '%x%'` on large tables.

**Caching**
- Public, anonymous reads (home, browse, item detail) can be cached briefly (`Cache-Control`/Next caching, revalidate on change). **Never cache anything user-specific or admin data in a shared cache.** When unsure, don't cache.
- Static reference data (Dzongkhags, categories, conditions) are constants in code, not DB queries.

**Heavy work off the request path**
- Image processing (resize to WebP 480/960/1440, strip EXIF), notifications and emails run asynchronously, not while the user waits. Return fast, process after.

## 4. Easy to fetch (client side contract)

- Procedure names read like actions: `listing.list`, `listing.get`, `listing.create`, `booking.request`, `booking.accept`, `report.create`, `listing.approve`.
- Consistent inputs: `{ cursor?, limit?, filters }` for lists; `{ id }` for single items. Consistent outputs: `{ items, nextCursor }`.
- Errors are tRPC codes (`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `CONFLICT`, `TOO_MANY_REQUESTS`) with short safe messages the UI can show.
- Mutations are idempotent where possible (retrying a flaky request must not create duplicate listings or bookings: use unique constraints or an idempotency key).
- Types flow from the router to the client; don't redefine response types by hand.

## 5. Security stays on in every shortcut

Sharing an API or caching must never weaken a check. For every procedure, before finishing:

1. Which tier (`public` / `protected` / `admin`) and why?
2. Does the server compute visibility from `ctx`, not from client input?
3. Strict input schema with length and range limits?
4. Ownership/role checked in the query or service?
5. Response limited to a DTO with no leaked fields (phone, address, email)?
6. Index and limit make it safe from slow or huge queries?
7. Tests written for every viewer type (anonymous, owner, other user, admin) and passing.

## 6. Avoid

- Duplicate routers for user vs admin, copy-pasted queries, `SELECT *`, unbounded lists, per-row queries in loops, business logic in routers, returning DB rows directly, trusting client-sent roles/status/ownerId, caching private data, premature complexity.
