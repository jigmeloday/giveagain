---
name: giveagain-deploy
description: Deployment, environments, env variables, backups, monitoring and production-readiness rules for GiveAgain. Use whenever configuring hosting, environment variables, CI, database operations, logging/monitoring, or preparing a release.
---

# GiveAgain deploy and operations

Hosting is **not decided yet**; ask the user before choosing (Vercel for Next.js plus Neon Postgres is a natural fit, but confirm). Keep configuration in env vars so the host can change. Security rules are in `giveagain-security`.

## Environments

- `development` (local), `test` (CI, throwaway DB), `staging` (optional, production-like with fake data), `production`.
- Separate database, secrets, storage bucket and auth secret per environment. Never point dev or tests at production.
- Branch databases (e.g. Neon branching) are good for previews and testing migrations on real-shaped data without touching production.

## Env variables

- Names only in `.env.example`; real values in the host's secret store and local `.env.local` (git-ignored).
- Validate with a Zod env module at startup; the app refuses to start if something is missing.
- Server secrets never get a `NEXT_PUBLIC_` prefix. Expected: `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` for migrations, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, storage credentials, SMS/email keys.

## CI

On every PR: install (lockfile frozen), `typecheck`, `lint`, unit/backend tests against a test Postgres, build, `npm audit` (fail on high). E2E on main or before release. Block merging on failures.

## Release checklist

- [ ] Migrations reviewed, applied to staging/branch first, then production **before** the new code that needs them (backward-compatible changes).
- [ ] Production env vars set and validated; secrets rotated if ever exposed.
- [ ] HTTPS only, HSTS on; security headers present; cookies `Secure`.
- [ ] Admin account created with a one-off script; no seed data in production.
- [ ] Rate limits and upload limits on; CORS and trusted origins set to the real domain.
- [ ] Error tracking and logging on (below); backups verified.
- [ ] Domain, DNS, email sender domain (SPF/DKIM) configured if emails are used.
- [ ] Smoke test on production: browse, sign up, post, approve, book.

## Database operations

- Automated daily backups plus point-in-time recovery if available; **test a restore** on a schedule, not only when needed.
- Least-privilege app role; separate migration role. Use the pooled connection string for the app.
- Monitor connections, slow queries (`pg_stat_statements`), and storage size.

## Monitoring and logging

- Error tracking (e.g. Sentry) on client and server; alert on error spikes.
- Structured server logs with request id; **no PII, tokens, passwords or full bodies**. Mask phones.
- Uptime check on a lightweight health endpoint (no secrets, no heavy DB work).
- Track the basics the NGO cares about: listings, bookings, items given, reports, moderation backlog.

## Performance and cost

- Serve images via CDN with long caching; compress responses; static reference data in code.
- Keep serverless functions short; heavy work (image processing, notifications) runs in the background.
- Watch bandwidth and storage; clean up orphan uploads. This is an NGO project: keep hosting costs low and predictable.

## Incident basics

If something breaks or data may be exposed: take the affected feature offline or restrict it, rotate secrets, fix, add a regression test, and tell the user plainly what happened and who might be affected.
