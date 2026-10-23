---
name: giveagain-frontend
description: Frontend code-structure rules for GiveAgain: 150-line file limit, one component per file, no helper functions inside component or page files, logic in hooks/utils, shared files. Use whenever creating or editing any page, component, hook or frontend utility.
---

# GiveAgain frontend structure

How frontend code is organised. Visual rules are in `giveagain`, component/library rules in `giveagain-ui`, backend in `giveagain-security`.

## 1. 150-line limit

- **Every component and page file stays under 150 lines.** Check the line count before finishing; if a file goes over, split it.
- Split by responsibility, not arbitrarily: pull sub-sections into their own components, logic into hooks, constants into data files.
- Pages (`page.tsx`, `layout.tsx`) are thin: fetch/compose and render section components. They contain almost no markup of their own.

## 2. A component file contains only the component

A component or page file holds **one exported component** and its props type. It must not contain:

- helper functions (`function calculate…`, `const format… = () =>` declared at module level or inside the component),
- business logic, data transformation, validation, or API-shaping code,
- big constant arrays/objects (option lists, config, copy), or multiple unrelated components.

```tsx
// Bad: logic lives in the component file
export default function Pricing() {
  const calculation = () => { … }
  function formatDate() { … }
  …
}

// Good: logic lives elsewhere, component only renders
import { useListingForm } from "@/hooks/use-listing-form";
import { timeAgo } from "@/lib/format";

export default function ListingForm() {
  const { form, onSubmit, isPending } = useListingForm();
  return …;
}
```

Where the logic goes:

| What | Where |
|---|---|
| State, effects, handlers, form setup, tRPC calls for a component | custom hook in `hooks/` (`use-<name>.ts`), or next to the feature (`components/<feature>/use-<name>.ts`) |
| Pure helpers (formatting, dates, slugs, calculations) | `lib/` (`lib/format.ts`, `lib/<topic>.ts`) |
| Constants, option lists, Dzongkhags, categories, conditions | `constants/` or `lib/constants/` |
| Zod schemas | `schemas/` (shared with the server where possible) |
| Types | `types/` or beside the feature |
| Animation variants | `lib/motion.ts` |

Allowed in the component file: calling hooks, destructuring their results, and passing them to JSX. Trivial inline props like `onClick={close}` or `onChange={(v) => setValue(v)}` are fine. If a handler needs a body with real logic, move it into the hook.

## 3. Share instead of repeat

- Before creating anything, search for an existing component, hook, util or constant. Reuse or extend it.
- If something is needed in **two places**, make it shared at once:
  - UI used across features → `components/shares/`
  - UI used in one feature → `components/<feature>/`
  - Hooks → `hooks/`, helpers → `lib/`, constants → `constants/`
- Don't copy-paste a block and tweak it; add a prop or variant to the original.
- Don't create abstractions for something used once and unlikely to repeat, but still obey the 150-line limit.

## 4. File and naming conventions

- Files kebab-case (`item-card.tsx`, `use-booking.ts`), components PascalCase, hooks `useX`, constants UPPER_SNAKE or camelCase objects.
- One component per file; the file name matches the component.
- Named exports for components, hooks and utils; default exports only where Next requires them (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Import with the `@/` alias, no deep relative paths (`../../../`).
- Feature folders: `components/listings/`, `components/bookings/`, `components/admin/`, each with its own small components and hooks.
- Server Components by default; `"use client"` only on the smallest component that needs it. Don't mark whole pages client.
- No `any`; type props and hook returns. No commented-out code, no stray `console.log`.

## 5. Typical shape of a feature

```
components/listings/
  listing-form.tsx          # < 150 lines, renders fields only
  listing-form-fields.tsx   # split out if the form grows
  use-listing-form.ts       # react-hook-form, submit, tRPC mutation
schemas/listing.ts          # Zod schema
constants/listing.ts        # categories, conditions
lib/format.ts               # timeAgo, etc.
```

## 6. Before finishing

1. Count lines in every file you touched (`wc -l`); none of the component/page files may exceed 150.
2. Grep your component files for module-level or nested helper functions and move them out.
3. Check you didn't duplicate something that already exists.
4. Run `tsc --noEmit` and lint.
