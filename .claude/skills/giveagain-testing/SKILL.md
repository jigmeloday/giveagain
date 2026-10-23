---
name: giveagain-testing
description: Testing setup and conventions for GiveAgain: Vitest, test database, factories, tRPC createCaller, component tests, Playwright end-to-end, definition of done. Use whenever writing, running or reviewing tests, or finishing any feature or bug fix.
---

# GiveAgain testing

The rule that backend changes **must** ship with tests is in `giveagain-security` (what each procedure must test). This skill is the how.

## Tools

- **Vitest** for unit and backend integration tests. **React Testing Library** for components. **Playwright** for end-to-end on key flows. Add them if missing; check installed versions' docs.
- Scripts in `package.json`: `test` (all fast tests), `test:watch`, `test:e2e`, plus `typecheck` and `lint`.

## Layout

- Tests next to the code (`listing.service.test.ts`) or in `__tests__/`; e2e in `e2e/`. Pick one style and stay consistent.
- Test files follow the same 150-line guideline; split by behavior.
- Shared helpers in `tests/`: `factories.ts`, `callers.ts`, `db.ts`.

## Backend tests

- Call tRPC routers with `createCaller` and a fake context; no HTTP server needed.
- **Real PostgreSQL test database** (never mocks for SQL, never dev/prod data). Run migrations once, then reset per test (truncate or a rolled-back transaction).
- Standard callers from one helper: `anonymous`, `userA`, `userB`, `admin`, `suspendedUser`. Every procedure is tested against the relevant ones.
- **Factories** (`makeUser`, `makeListing({status})`, `makeBooking`) with sensible defaults, so each test states only what matters.
- Test names describe behavior: "rejects booking own listing", "hides pending listings from anonymous".
- Race conditions: fire concurrent calls (`Promise.all`) to prove unique constraints and transactions hold (two users booking, double accept).
- Security regressions get a permanent test (IDOR, leaked phone/address, role escalation, missing auth).
- Mock only external services (SMS, email, storage), through a thin interface, never the database or our own code.

## Frontend tests

- Test behavior the user sees, with Testing Library: roles and labels, not class names or implementation.
- Cover: shared inputs (label, error, `aria-invalid`), `PasswordInput` toggle, `PhoneInput` validation, forms (validation messages, disabled while submitting, server error shown), `ItemCard` (FREE badge, never a price), empty/loading/error states.
- Hooks tested with `renderHook`; pure helpers in `lib/` with plain unit tests (the easiest and most valuable).

## End-to-end (Playwright)

Keep few and focused on critical paths, at **phone viewport** first:
1. Anonymous browse and search → item detail → prompted to sign in to book.
2. Sign up → post a listing → appears as pending, not public.
3. Admin approves → listing public.
4. Another user books → giver sees request → accepts → item reserved, phone/address visible only to the right people.
5. Report a listing → admin sees it.

Use seeded data and a dedicated test database; tests must not depend on each other.

## Quality bar

- Deterministic: no real time, randomness or network (fake timers, fixed ids).
- Independent: any test can run alone, in any order.
- Fast: unit and backend tests in seconds. Slow ones go to e2e.
- Coverage is a signal, not a goal. Business rules, auth and privacy paths need near-complete coverage.
- Never weaken or delete a test to make it pass. Never skip silently.

## Definition of done

1. Tests written for new/changed behavior (bug fix = failing test first).
2. `typecheck`, `lint` and `test` all pass; paste or summarize the real results.
3. Component/page files ≤ 150 lines (`giveagain-frontend`).
4. If something was not run or tested, say so plainly.
