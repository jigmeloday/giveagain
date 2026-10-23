---
name: giveagain-workflow
description: Git, branching, commit, PR and definition-of-done workflow for GiveAgain. Use whenever committing, branching, opening a PR, finishing a task, or deciding what to check before calling work complete.
---

# GiveAgain workflow

## Before writing code

1. Read the relevant skills: `giveagain` (product), `giveagain-frontend` / `giveagain-ui` for UI, `giveagain-backend` / `giveagain-database` / `giveagain-security` for server work, `giveagain-testing`, and others as needed.
2. This Next.js has breaking changes: read the matching guide in `node_modules/next/dist/docs/` before routing, data fetching, metadata or config work ([AGENTS.md](../../../AGENTS.md)).
3. Search for existing components, hooks and helpers before creating new ones.
4. If a requirement is genuinely unclear or touches an open decision (photo storage, sign-in method, notification channel), ask. Otherwise pick the conventional option and say so.

## Git

- Work on a branch, not `main`: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Small, focused commits; one logical change each. Message: imperative, short subject (`Add listing moderation queue`), body explains *why* when not obvious.
- **Commit or push only when the user asks.** Never force-push `main`, never skip hooks, never commit secrets or `.env*`.
- Don't commit generated or local files (`.next`, `node_modules`, test output). Review `git status` and the diff before committing; stage specific files.
- Keep `package-lock.json` in sync with `package.json`; add dependencies deliberately and mention why.

## Pull requests

- Small and reviewable. Description: what changed, why, how to test, screenshots for UI at phone width, notes on security impact and migrations.
- Include the checklist results (below). Link the related issue if any.
- Database migrations are called out explicitly, with rollback or recovery notes.

## Definition of done

Work is done only when all of these hold (and you report the real results, including anything not run):

- [ ] Behavior works as the product rules require (free-only, privacy, moderation).
- [ ] Tests written for new/changed behavior; backend changes have full security/auth tests (`giveagain-security`, `giveagain-testing`).
- [ ] `tsc --noEmit`, lint and tests pass.
- [ ] Component/page/backend files ≤ 150 lines; no helper functions inside component files; no duplicated code (`giveagain-frontend`).
- [ ] Shared components reused; inputs take `label`/`error` (`giveagain-ui`).
- [ ] Copy follows `giveagain-content` (free-only wording, friendly errors); no raw hex colors; no dark-mode code.
- [ ] Checked at phone width and desktop; loading, empty and error states exist; keyboard and focus work.
- [ ] No secrets, PII in logs, or `console.log` left; env vars documented in `.env.example`.
- [ ] Migrations are forward-only and tested (`giveagain-database`).

## Working style

- Make the change the user asked for; don't refactor unrelated code or add unrequested features. Mention noticed problems instead.
- Prefer the simplest solution that is secure and fast.
- Be honest in reports: say what was verified, what wasn't, and what failed.
