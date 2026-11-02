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
