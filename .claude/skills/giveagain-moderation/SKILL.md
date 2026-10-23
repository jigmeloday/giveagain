---
name: giveagain-moderation
description: Moderation, reporting and admin-site rules for GiveAgain: listing review queue, reports, user suspension, audit log, prohibited items. Use whenever building or changing admin pages, moderation or report features, or listing status transitions.
---

# GiveAgain moderation and admin

Moderation is the NGO's trust layer: the site must feel safe for neighbors. Listings are reviewed before going public. Procedures are shared with the user site (`giveagain-backend`); security rules in `giveagain-security`.

## Listing review

- New listing → `pending`. Only the owner and admins can see it.
- Admin **approves** (→ `available`) or **rejects** (→ `rejected`, **reason required** from a fixed list plus optional note).
- Rejected listings can be edited and resubmitted (→ `pending`). Editing an approved listing's key content (title, photos, description, category) sends it back to `pending`; minor fields do not.
- The owner is told the outcome and the reason, in plain, kind language.
- Review queue: oldest first, shows photos, text, owner history (previous approvals, reports), with quick approve/reject and keyboard-friendly actions. Aim for a short review turnaround; show the owner an expected time.

## Prohibited items (initial list, confirm with the NGO)

Not allowed: anything sold or priced ("selling", prices, "or best offer"), weapons, alcohol, tobacco, medicines, live animals, stolen or unsafe goods (e.g. damaged car seats, expired food), adult content, services or jobs, personal info of others. Reject reasons mirror this list.

## Reports

- Any signed-in user can report a listing or a user, from the item page; one report per reporter per target.
- Reasons: `prohibited_item`, `selling_or_price`, `fake_or_misleading`, `inappropriate_photo`, `scam_or_unsafe`, `no_show_or_harassment`, `other` (with details, max length).
- Admin report queue: open reports first, grouped by target, with context (the listing, reporter, other reports).
- Admin actions: **dismiss**, **hide listing** (→ back to `pending`/`rejected` with reason), **warn user**, **suspend user**. Every action needs a reason.
- **Auto-hide:** a listing with reports from N distinct users (suggested N = 3) is hidden pending admin review. Confirm N with the NGO. Report bombing by one user can't trigger it, and reporter identity is never shown to the reported user.
- Don't reveal who reported. Thank reporters with a neutral confirmation.

## User suspension

- Suspended users cannot sign in or act; their sessions are revoked and active listings hidden. Reversible by an admin, with reason.
- Repeated violations: warn → temporary suspend → permanent. Keep the rules written and consistent.

## Audit log

- Every admin action writes an append-only `audit_log` entry: who, what, target, reason, time. No admin action is anonymous and the log can't be edited or deleted by the app.
- Admin list/detail screens show the history of a listing or user.

## Admin site

- Lives at `/admin`; guarded by middleware for UX and by `adminProcedure` for real enforcement.
- Pages: Moderation queue · Reports · Users · All listings (filters by status, Dzongkhag, date) · Audit log.
- Reuses the same shared components, procedures and `giveagain-ui` rules; plain, fast, table-based, mobile-usable.
- Admins can only be created server-side (seed/script); consider stronger auth for them.
- Admin pages never cache and never expose data to non-admins.

## Roles (future)

Start with `user` and `admin`. A `moderator` role (review and reports, no user management) can be added later through the same role checks.

## Tests (required)

Cover: non-admins cannot call admin actions; pending/rejected invisible to others; reason required; status transitions allowed/blocked; one report per user per target; auto-hide threshold; suspension blocks everything; audit entry written for every admin action; reporter identity never in responses.
