---
name: giveagain
description: Product, domain and design rules for GiveAgain, a free-giveaway website for communities in Bhutan. Use whenever building or changing any page, component, copy, data model or flow in this project (listings, requests, item cards, search, forms, styling).
---

# GiveAgain

A community website, run as an NGO project, where people in Bhutan give away things they no longer need, for free, so less goes to waste. It is not a marketplace. Nothing is for sale.

## Core flow

1. **Browse (no account):** anyone can see listings, search and open item pages.
2. **Giver** signs in and posts a listing: photos, name, condition, description, area. It goes into **moderation** and is only public once an admin approves it.
3. **Seeker** finds an item (e.g. an old sofa in good condition) and signs in to **book** it ("Ask for it — free"), leaving their contact (phone) and an optional short note.
4. **Giver contacts the seeker** using the contact details from the booking, and arranges pickup. If several people book, the giver chooses one.
5. The giver marks the item **given**. No payment, ever.

**One account type.** Every user can both give and receive; there are no separate giver/seeker roles. Admin is a separate role.

Listing states: `pending` (awaiting moderation) → `available` → `reserved` → `given`; plus `rejected` (admin) and `withdrawn` (giver). Booking states: `requested` → `accepted` / `declined` / `cancelled`.

**Moderation and reports:** admins approve or reject new listings, and handle user **reports** on listings or users (hide an item, warn or suspend a user). Reports can be filed from any item page by signed-in users.

## Rules that must hold

- **No prices, no money, no payment fields, no "sell" wording.** Every item is clearly marked FREE.
- Item cards show name, approximate area (e.g. "Motithang, Thimphu"), condition and age. **Never** show a precise address publicly. Share it only after the giver accepts a request.
- Location is chosen from a Dzongkhag list (and area within it). Bhutan context: Dzongkhags, Thimphu, Paro, etc. Contact is likely phone-first, so consider phone/WhatsApp-friendly flows. Mobile-first: most users are on phones with variable connections.
- Language: English only, plain, warm, short (see `giveagain-content`).
- Condition tags: `Like new`, `Good`, `Fair`. Keep the list small and consistent.
- Categories (starting set): Furniture, Books, Kitchen, Clothing, Kids, Electronics, Other.
- Keep personal data minimal. A seeker's phone is visible only to the giver of the item they booked, and the giver's exact address only to the accepted seeker. A user cannot book their own item.

## Design system

Defined in [app/globals.css](../../../app/globals.css) as tokens. Light only: there is **no dark mode or theme toggle**. Do not add one. Direction comes from the owner's reference design: editorial and bold, hard edges, a visible line grid, one orange accent. Nothing is for sale, so it must not look like a shop.

- **Feel:** warm grey paper, near-black ink, heavy tight headlines, thin hard lines dividing the page into cells, mono uppercase labels. Lots of space inside cells. No shadows, no gradients, no rounded corners.
- **Colors (use the Tailwind token, not raw hex):** `background` warm grey page (`#F1F1EF`), `foreground` ink, `mist` panels and photo placeholders, `line` (alias of `border`) for the grid and dividers, `primary` orange `#D93A12` for fills and big banners (white text on it is 4.6:1), `primary-dark` for hover, `primary-ink` for small orange text on the page (5.3:1; plain `primary` fails 4.5:1 there), `muted-foreground` for meta text, `destructive` dark red for errors only. Field borders use `input` (darker than `line`).
- **Type:** Archivo for everything (`font-sans`), JetBrains Mono for labels (`font-mono`). Headlines weight 800 with tracking about `-0.04em` and line-height about 0.95 (hero scales with `clamp`, roughly 44 to 88px); card titles 700 at 15px; body 400 at 16px; labels mono, 11px, uppercase, `tracking-[0.08em]`, usually `text-primary-ink` (the kicker above a headline, the category on a card, step numbers).
- **Shape:** radius is **0 everywhere** (the radius tokens are zeroed, so `rounded-*` stays square). Separate things with 1px `border-line` borders on cells, not cards with shadows.
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 56, 72.
- **Buttons:** at least 44px tall, bold text, an arrow or plus icon on the right for main actions. Primary "Give something away" = filled orange. Secondary "See what's free nearby" = transparent with a dark ink border. Text links are `primary-ink`, underlined on hover.
- **Page rhythm:** top bar (logo square plus name, text links, orange "Give something" button) → hero split in two cells (headline, one short paragraph and two buttons on the left; photo on the right) → three numbered step cells → a "This is not a marketplace" strip with struck-through "Prices / Bidding / Selling / Delivery fees" → "Just posted" row of item cards → full-width orange closing banner with the footer links inside it.
- **Placeholders:** where a photo has not loaded, use a `mist` block with thin diagonal lines and a small mono caption.
- **Errors:** dark-red border plus a short helpful message below the field (e.g. "Choose where the item can be collected."); never color alone, add the message.
- **Item card:** square photo, then a mono uppercase category label in `primary-ink` with the approximate area on the right, then the item name (and condition and age, e.g. "Good · 2 hours ago"). The card must still make clear the item is free: show a small mono "FREE" label. Never a price. (Open question for the owner: whether a FREE badge is wanted on every card, since the reference shows none.)
- **Photos:** real daylight photos of the actual item, whole item first; black and white is fine for editorial images. WebP at 480 / 960 / 1440 px, lazy-loaded behind the placeholder. Use `next/image`.
- **Contrast:** all text pairs must pass 4.5:1.

## Tech stack and conventions

- Next.js App Router, TypeScript, Tailwind v4, shadcn/ui (style `base-nova`, config in [components.json](../../../components.json)), lucide icons. Components in `components/`, shadcn primitives in `components/ui/`, helpers in `lib/`, import alias `@/`.
- **Auth: Better Auth.** **Database: PostgreSQL (`pg`).** **API: tRPC.** Don't introduce another auth, ORM-less data layer or REST route style for app logic; put procedures in tRPC routers.
- tRPC procedure tiers: `publicProcedure` (browse/search approved listings only), `protectedProcedure` (signed in: create listing, book, report), `adminProcedure` (role `admin`: moderation queue, reports, user actions). Enforce ownership and role checks on the server, never only in the UI.
- Public queries must filter to approved listings (`available` / `reserved`); `pending` and `rejected` are visible only to the owner and admins.
- The admin site lives in the same app under `/admin`, guarded by the admin role.
- **This Next.js version has breaking changes.** Before writing routing, data fetching, metadata or config code, read the relevant guide in `node_modules/next/dist/docs/` (see [AGENTS.md](../../../AGENTS.md)). Check the Better Auth and tRPC docs for the installed versions too; don't rely on memory.
- Prefer Server Components; add `"use client"` only for interactivity (search, forms, save heart).
- Add shadcn components with the CLI rather than hand-writing them, then restyle through tokens, not per-component hex colors.
- Match surrounding code style; keep components small and typed.

## Suggested pages

**Public/user:** Home (hero, search, categories, new giveaways) · Browse/search with filters (category, Dzongkhag, condition) · Item detail (photos, details, "Ask for it", report) · Give something away (listing form) · My listings (with incoming bookings) · My bookings · Sign in/up.

**Admin (`/admin`):** Moderation queue (approve/reject with reason) · Reports · Users · Listings overview.

## Open decisions (ask the user before assuming)

- Where photos are stored (Neon is connected but not authorized yet).
- Sign-in method (email/password, phone OTP, Google) given a Bhutan audience.
- Whether the NGO wants impact stats (items saved from waste) on the home page.
