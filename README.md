# GiveAgain

A community website where people in Bhutan give away things they no longer need, for free. It is not a marketplace: no selling, bidding or prices.

Stack: Next.js (App Router), TypeScript, Tailwind v4, shadcn/ui, Better Auth, tRPC, PostgreSQL (`pg`), Vitest, Playwright.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run typecheck` | Generate Next route types, then `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Unit, backend and component tests (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests (phone and desktop) |

First time running e2e: `npx playwright install chromium`.

## Project rules

Product, design, security and testing rules live in [.claude/skills/](.claude/skills/). Read `giveagain` first.

## Backend (local setup)

Needs Postgres running locally. Copy `.env.example` to `.env.local` and fill it in, then:

```bash
createdb giveagain_dev && createdb giveagain_test
npm run db:migrate        # apply migrations to the dev database
npm run db:seed           # fake admin, users and listings (dev only, local databases only)
npm test                  # migrates the test database itself, then runs everything
```

On Neon (or any non-local database) the seed refuses to run. Create the first admin with `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:create-admin` (password at least 12 characters).

Seeded sign-ins on a local database (password `password1234`): `admin@example.com` (admin), `pema@example.com`, `karma@example.com`.
Migrations are plain SQL in `db/migrations/`, forward-only. If the Better Auth config changes, regenerate its SQL with `node --env-file=.env.local scripts/generate-auth-sql.ts` and save it as a new migration.

## Prisma (read-only tool)

Prisma 7 is installed only to look at the database, not to run it. The SQL files in `db/migrations/` stay the source of truth and the app talks to the database with `pg`.

```bash
npm run prisma:studio   # browse and edit data in the browser (uses DATABASE_URL_UNPOOLED)
npm run prisma:pull     # refresh prisma/schema.prisma from the live database
```

Never run `prisma migrate`, `db push` or `db update` here: they would change the database outside our migrations. To change the schema, add a SQL migration and run `npm run db:migrate`, then `npm run prisma:pull`.

## Photo storage (Neon Object Storage)

Listing photos are stored in a Neon bucket called `photos` (public read, so approved photos load fast; every file name is a random UUID under the owner's folder). The server checks each upload by its real bytes, drops all metadata (including GPS), re-encodes it as WebP at most 1440px wide, and only then stores it.

One-time setup, from this folder:

```bash
neon login                                   # sign in (opens the browser)
neon projects list                           # find your project id
neon bucket create photos --project-id <id> --access-level public_read
cp .env.local .env.local.backup              # `neon env pull` can overwrite values: keep a copy first
neon env pull --project-id <id>              # adds AWS_ENDPOINT_URL_S3, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
```

After pulling, open `.env.local` and make sure `DATABASE_URL`, `DATABASE_URL_UNPOOLED` and `TEST_DATABASE_URL` still point at the `giveagain` and test databases. Restart `npm run dev` so the new variables load.
