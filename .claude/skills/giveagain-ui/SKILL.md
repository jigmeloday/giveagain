---
name: giveagain-ui
description: Frontend/UI rules for GiveAgain: shadcn components, shared wrapper components in components/shares, label/error-aware form inputs, react-hook-form, framer-motion animation, Swiper carousels, accessibility. Use whenever building or changing any page, component, form, input, or animation.
---

# GiveAgain UI rules

Look and tokens live in the `giveagain` skill and [app/globals.css](../../../app/globals.css). This skill covers **how we build UI**. Backend code follows `giveagain-security`.

## Libraries

| Need | Use |
|---|---|
| Components | **shadcn/ui** for everything (button, dialog, select, tabs, sheet, toast, table, etc.). Add with the CLI (`npx shadcn@latest add <name>`), never hand-write a shadcn primitive. |
| Carousel / slider | **Swiper** (`swiper`, already installed). Do **not** add shadcn's carousel (Embla). |
| Animation | **framer-motion** (already installed). No other animation library; simple hover/focus states stay in CSS/Tailwind. |
| Forms | **react-hook-form** (+ Zod resolver, same Zod schemas as the server where possible). |
| Icons | lucide-react. |

Check the installed versions' docs (framer-motion and swiper are new major versions; Next.js has breaking changes per [AGENTS.md](../../../AGENTS.md)) before using an API from memory.

## Reuse first

1. Before writing UI, search `components/` for something that already does it. Extend it with a prop rather than copying it.
2. If the same markup or logic appears **twice**, extract a component. Three similar blocks is always a missed component.
3. Style through design tokens (`bg-primary`, `text-muted-foreground`, `rounded-lg`), never raw hex values or one-off spacing.
4. Keep components small, typed, and focused. Server Components by default; `"use client"` only where needed.

## Folder layout

- `components/ui/` shadcn primitives. Only changed by the shadcn CLI or for token-level restyling. Don't put app logic here.
- `components/shares/` **shared app components** built on top of shadcn (see below). Import from here in pages.
- `components/<feature>/` feature-specific components (e.g. `listings/`, `admin/`), used by one area.
- Name files in kebab-case (`password-input.tsx`), components in PascalCase, one main component per file.

## Shared components in `components/shares/`

Create a shared component when:
- a field needs behavior beyond the raw primitive (e.g. **password input with show/hide toggle**),
- a shadcn component needs **several imports and boilerplate** to use (e.g. `Select` = `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`; same for Dialog, Popover/Combobox, RadioGroup, Tabs, DropdownMenu),
- the same composition is used in more than one place.

The shared component hides the multi-part API behind one simple, typed prop interface. Pages should **never** assemble these parts by hand.

Starting set (create as needed, don't duplicate):
- `Input` (text, email, etc.), `PasswordInput` (show/hide), `Textarea`, `Select` (options array), `Checkbox`, `RadioGroup`, `Switch`, `Combobox`.
- `PhoneInput`: country code + number. **For now render only the button/placeholder for the country code** (Bhutan +975 fixed); the real country picker comes later. Keep the prop API ready for it. The value passed to forms is the number plus country code; validation uses the shared phone Zod schema built on Google's libphonenumber (`google-libphonenumber`, region `BT`), the same one the server uses, so client and server never disagree. Import it lazily if bundle size matters, and display numbers formatted from the E.164 value.
- `ImageUpload` (photos with previews), `FormDialog`, `ConfirmDialog`, `EmptyState`, `FreeBadge`, `ConditionTag`, `ItemCard`.

## Form inputs: label and error go **into** the input component

Never compose a field from loose `<label>`, `<Field>`, `<input>` and an error `<p>` in page code. Every input-like shared component owns its label, helper text and error display.

```tsx
// Good
<Input label="Item name" placeholder="Wooden study desk" error={errors.name?.message} />
<Select label="Dzongkhag" options={dzongkhags} error={errors.dzongkhag?.message} />
<Textarea label="Description" error={errors.description?.message} />
<PasswordInput label="Password" error={errors.password?.message} />

// Bad
<div><label>Item name</label><input /><p>{error}</p></div>
<Field><FieldLabel>…</FieldLabel><FieldError>…</FieldError></Field> // in page code
```

Rules for these components:
- Common props: `label`, `error`, `hint` (optional helper), `required`, `disabled`, plus the underlying element's props (spread them; forward `ref`).
- Wire accessibility inside the component: `label` tied to the control via `id`/`htmlFor` (use `useId`), `aria-invalid` when there is an error, `aria-describedby` pointing at the error/hint, error announced with `role="alert"` or `aria-live`.
- Error style follows the design system: red border (`destructive`) and a short message below the field.
- Same API for Input, PasswordInput, PhoneInput, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, ImageUpload, so forms look and read the same everywhere.
- Hardcoded UI text stays out of these components; labels come from props.

## Forms with react-hook-form

- Define a Zod schema, use `useForm` with the Zod resolver, and `Controller`/`register` to connect inputs. Prefer a small `FormField`-style helper in `components/shares/` if wiring repeats, so pages stay one line per field.
- Pass `error={errors.field?.message}` straight to the input component.
- Disable the submit button and show a loading state while submitting. Prevent double submit.
- Show server errors (from tRPC) as a form-level message or mapped to fields via `setError`. Never show raw server error text that leaks internals.
- Client validation is for UX only; the server validates again (see `giveagain-security`).
- Keep messages short and helpful ("Choose where the item can be collected.").

## Animation with framer-motion

- Use it for meaningful motion: page/section entrance, list items appearing, dialogs/sheets, save-heart pop, request-sent confirmation. Not for decoration everywhere.
- Short and subtle: 150–300ms, ease-out, small distances (8–16px), opacity + transform only (no layout-thrashing properties).
- **Respect reduced motion:** use `useReducedMotion` / `MotionConfig reducedMotion="user"` at the root.
- Shared variants (fade-in, fade-up, stagger) live in one file (e.g. `lib/motion.ts`); don't redefine them per component.
- Motion components are client components; keep the `"use client"` boundary as small as possible (wrap the animated part, not the whole page).

## Carousels with Swiper

- Use `swiper` for sliders (hero banner, item photo gallery, related items). Wrap it once in a shared component (e.g. `shares/carousel.tsx`) that imports the needed modules and CSS, so pages don't repeat setup.
- Client component only. Provide keyboard access and visible controls; photos use `next/image` with `sizes`, lazy-loaded except the first slide.

## Layout, responsiveness, accessibility

- **Mobile-first.** Design for ~360px wide, then scale up. No horizontal scroll. Touch targets at least 44px.
- Every page has loading (skeleton), empty and error states, using the shared `EmptyState` and shadcn `Skeleton`.
- Semantic HTML (`main`, `nav`, headings in order, buttons vs links). Visible focus rings (`ring` token). All images have meaningful `alt` text (describe the item). Icon-only buttons have `aria-label`.
- Contrast 4.5:1 minimum; never use color alone to convey status.
- Use `next/image` for photos, `next/link` for navigation, `next/font` (Figtree) already set up.
- Light theme only. No dark mode, no theme toggle, no `dark:` styling.

## Copy

Plain, warm, short. Free-only: never "buy", "price", "sell". Buttons: "Give something away", "Ask for it — free". Put text in one place per component. See `giveagain-content`.

## Before finishing UI work

Run `tsc --noEmit` and lint. Check in the browser at phone width and desktop: states, keyboard navigation, and the form error paths. If you could not view it, say so rather than claiming it works.
