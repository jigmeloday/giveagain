---
name: giveagain-security
description: Mandatory security and backend-testing rules for GiveAgain. Use whenever writing or changing any backend code (tRPC routers, Better Auth config, SQL/pg queries, server actions, route handlers, uploads, middleware, env/config) and whenever reviewing code. Requires tests for every backend change.
---

# GiveAgain security and backend testing

GiveAgain handles real people's phone numbers, locations and photos. Treat the backend as hostile territory: **every input is untrusted, every caller is unproven until the server checks.** Product rules live in the `giveagain` skill; this skill is the security bar on top of it.

## The testing rule (non-negotiable)

**Whenever backend code is written or changed, write tests for it in the same change, run them, and report the result.** Do not call backend work done without them.

Every procedure/handler needs tests for:

1. **Happy path:** works with valid input and the right user.
2. **Validation:** missing, wrong-type, oversized, empty and malformed input is rejected.
3. **Authentication:** unauthenticated callers get `UNAUTHORIZED` on every protected/admin procedure.
4. **Authorization:** wrong role or wrong owner gets `FORBIDDEN` (user A cannot edit, withdraw, accept bookings on, or read private data of user B's listing; a normal user cannot call admin procedures).
5. **Business rules:** state transitions (`pending → available → reserved → given`, booking states), cannot book own item, cannot book unavailable item, no double-booking, `pending`/`rejected` listings never visible publicly.
6. **Data exposure:** responses never include fields they shouldn't (other users' phone, exact address before acceptance, emails, password hashes, session tokens, internal ids not needed).
7. **Abuse and edge cases:** duplicate submits and races (two users booking at once), pagination limits, SQL-injection-style strings, very long strings, unicode, rate-limit behavior.

Setup expectations:
- Test runner: Vitest (add it if missing). Call tRPC routers through `createCaller` with a fake context so tests need no HTTP server.
- Use a **separate test database** (never dev or production data), reset between tests or wrapped in a transaction. Seed users: `userA`, `userB`, `admin`, and an anonymous caller.
- Tests are deterministic, independent and fast. Name them by behavior ("rejects booking own listing").
- Before finishing, run the tests, the type check (`tsc --noEmit`) and lint. If a test fails or is skipped, say so plainly with the output.
- A bug fix starts with a failing regression test.

## Authentication (Better Auth)

- Never hand-roll password hashing, sessions or tokens. Use Better Auth's built-ins; check the installed version's docs.
- Sessions in `HttpOnly`, `Secure`, `SameSite=Lax` (or stricter) cookies. No tokens in `localStorage`.
- Strong password policy (min length, breached/common check if supported), rate-limited sign-in, sign-up and password reset, and generic error messages that don't reveal whether an account exists.
- Email/phone verification before a user can book or post.
- `BETTER_AUTH_SECRET` is long, random, set per environment, never committed.
- Admin role is assigned only server-side (seed or admin tooling). Never accept a role from client input. Consider requiring stronger auth (e.g. 2FA) for admins.
- Suspended users are rejected on every request, not only at sign-in. Revoke their sessions.

## Authorization

- Check on the **server**, in the procedure, on every call. Hiding a button is not security.
- Use the tRPC tiers: `publicProcedure`, `protectedProcedure`, `adminProcedure`. A new procedure defaults to `protectedProcedure`; make it public only deliberately.
- Ownership checks fetch the resource and compare `ownerId` to `ctx.user.id` (or put it in the `WHERE`). Prevent IDOR: never trust an id from the client to mean "this is mine."
- Return `NOT_FOUND` rather than `FORBIDDEN` for resources the caller should not know exist (e.g. another user's `pending` listing).
- Public reads filter to approved listings in the query itself, not afterwards in JS.

## Input validation

- Every procedure has a strict **Zod** input schema (`.strict()` for objects, max lengths on all strings, enums for status/category/condition/Dzongkhag, bounded numbers, capped array sizes). Never pass raw input to the database.
- Validate on the server even if the form validates on the client.
- Never accept `id`, `ownerId`, `status`, `role`, `createdAt` or similar server-controlled fields from clients; set them on the server.
- Normalize and trim text.
- **Phone numbers:** validate with Google's libphonenumber (`google-libphonenumber` package, plus `@types/google-libphonenumber`) in a single shared module (`lib/phone.ts`) used by the Zod schema. Parse with default region `BT`, require `isValidNumber` (not just `isPossibleNumber`), and **store only the E.164 form** (e.g. `+97517123456`). Reject anything that fails to parse; never store the raw user string. Mask phones in logs. Tests must cover valid Bhutan numbers (with and without `+975`), spaces/dashes, too short/long, letters, empty, and numbers from other countries.
- Pagination: cursor/limit with a hard max (e.g. 50). No unbounded queries.

## Database (pg)

- **Parameterized queries only** (`$1, $2`). Never build SQL with string concatenation or template interpolation of user values. Dynamic column/table names come from an allow-list.
- Least-privilege DB user for the app (no superuser, no DDL at runtime). Migrations run with a separate credential.
- Use transactions for multi-step changes (accepting a booking + reserving the item + declining others). Prevent races with `SELECT … FOR UPDATE` or unique constraints/partial unique indexes (e.g. one accepted booking per item, one booking per user per item).
- Constraints in the schema, not just in code: `NOT NULL`, `CHECK` on enums/status, foreign keys, unique keys.
- Select only needed columns; never `SELECT *` into an API response.
- Connection string only from env; TLS to the database in production.

## Output and privacy

- Define explicit response shapes (DTOs); never return a raw DB row.
- Phone and exact address are released only per the rules in the `giveagain` skill (seeker phone → that item's giver; giver address → accepted seeker). Test it.
- Don't log PII, tokens, cookies, passwords or full request bodies. Errors to clients are generic; details go to server logs. No stack traces in production responses.
- Photos: strip EXIF (it can contain GPS location) before storing or serving.

## Uploads

- Allow-list MIME types and **verify by content (magic bytes)**, not extension or client header. Images only (JPEG/PNG/WebP).
- Max file size and max number of photos per listing, enforced on the server.
- Generate random filenames; never use user-supplied names or paths (no path traversal).
- Re-encode images server-side; serve from a separate storage origin/bucket with correct `Content-Type` and `X-Content-Type-Options: nosniff`.
- Use short-lived signed upload URLs scoped to the user; verify ownership when attaching a photo to a listing.

## Abuse and rate limiting

- Rate-limit by user and IP: sign-in, sign-up, password reset, create listing, book, report, upload. Stricter on auth.
- Quotas: e.g. max active listings per user, max pending bookings per user, max reports per day, to stop spam and scraping.
- Reports and moderation actions are written to an **audit log** (who, what, when, reason). Admin actions are never anonymous.
- Free-text fields (descriptions, notes, report reasons) are plain text: escape on output, never `dangerouslySetInnerHTML`.

## Web hardening

- **CSRF:** state-changing requests need Better Auth/tRPC CSRF protection and an Origin check; mutations are never `GET`.
- **CORS:** same-origin by default; an explicit allow-list if ever needed. Never `*` with credentials.
- Security headers via Next config/middleware: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`. Check the Next.js docs for this version's way to set them.
- HTTPS everywhere in production. `trustedOrigins` / base URL set explicitly.
- Redirect targets (e.g. after login) validated against an allow-list to prevent open redirects.
- Don't render user-supplied URLs server-side or fetch them (SSRF).

## Secrets and config

- Secrets only in environment variables; `.env*` is git-ignored. Provide a `.env.example` with names only.
- Never prefix a secret with `NEXT_PUBLIC_`. Validate env at startup (Zod) and fail fast if missing.
- Different secrets per environment. Rotate if ever exposed.
- Server-only modules marked with `import "server-only"` so DB and auth code cannot leak into client bundles.

## Dependencies and process

- Pin versions via the lockfile; run `npm audit` before releases; keep Better Auth, Next.js and tRPC updated. Add new dependencies sparingly and check them first.
- Admin routes `/admin` and `adminProcedure` are guarded together (middleware for UX, procedure for the real check).
- Back up the database; test restoring.
- Review checklist before merging backend work: auth tier correct? input schema strict? ownership checked? no PII leaked? parameterized SQL? transaction/constraint for races? rate limit? tests written and passing?

## When you find a vulnerability

Fix it, add a regression test, and tell the user plainly what it was and its impact. Don't quietly paper over it, and never weaken a check to make a test pass.
