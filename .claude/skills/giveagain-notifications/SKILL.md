---
name: giveagain-notifications
description: Notification and contact-handover rules for GiveAgain: booking requests, accept/decline, moderation outcomes, email/SMS/WhatsApp, privacy of contact details. Use whenever building notifications, emails, messages, or the booking-to-contact flow.
---

# GiveAgain notifications and contact

The product is built on a handover: a seeker books, the **giver contacts the seeker** (phone from the booking). Notifications make sure nobody is left waiting. Privacy rules are in `giveagain` and `giveagain-security`.

## Channel (not decided; ask the user)

Candidates: **in-app** (always), **email** (cheap, reliable), **SMS** (works for everyone, costs money, needs a provider with Bhutan coverage), **WhatsApp/Telegram link** (common locally; a "Contact on WhatsApp" button using the seeker's number after booking). Start with in-app + email; keep the sender behind one interface (`lib/notify.ts`) so channels can be added.

## Events

| Event | Who is told | Content |
|---|---|---|
| Listing submitted | Owner | Received, under review |
| Listing approved / rejected | Owner | Live now, or rejected **with the reason** and how to fix |
| New booking request | Giver | Item, requester's first name and note, link to review |
| Booking accepted | Seeker | Giver will contact you; keep your phone nearby |
| Booking declined / item given to someone else | Seeker | Kind message, suggestion to browse similar items |
| Giver hasn't responded (reminder) | Giver | Gentle nudge after a set time (e.g. 2 days) |
| Item reserved but not collected | Both | Reminder; option to release the item |
| Report actioned / listing hidden | Owner | What happened and next steps |
| Account suspended | User | Reason and how to appeal |

## Contact handover rules

- The giver sees the seeker's phone only for bookings on **their own** listings. The seeker sees the giver's exact address/contact only after **accept**.
- Provide tap-to-call and a WhatsApp link built from the E.164 number; never expose the number in public pages or API responses to others.
- Offer simple "pickup arranged / item given" confirmation buttons so the listing status stays accurate; auto-release stale reservations after a time limit (confirm duration with the NGO).
- Tell users plainly: meet in a safe, public place when possible; never pay or send money; report anyone who asks for payment.

## Rules for sending

- Triggered after the DB transaction commits, **asynchronously** (queue or background job), with **retries and idempotency** so a retry never sends duplicates. A failed notification must never fail the booking.
- Rate-limit per user and per target to prevent spam or harassment via booking requests.
- Notification text is English, short, kind and plain (`giveagain-content`); no marketing.
- Content minimization: emails/SMS carry only what's needed and a link, not full addresses or other users' phone numbers.
- Users can manage email preferences (except essential account/safety messages); every non-essential email has an unsubscribe.
- Log that a notification was sent (type, recipient id, status) without storing message bodies or contact details in logs.

## In-app

- A `notification` table (user, type, payload ids, read_at) and a small bell/inbox; list is paginated and fast. Payload references ids; the content is rendered at read time to avoid stale or leaked data.

## Tests (required)

Cover: each event notifies the right person only; no duplicate sends on retry; a failing sender doesn't break the booking; seeker phone/giver address never in a wrong recipient's message or response; rate limits; unsubscribe respected; templates render correctly.
