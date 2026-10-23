---
name: giveagain-content
description: English-only copy, wording, dates and formatting rules for GiveAgain. Use whenever writing user-facing text, labels, errors, emails, empty states, or formatting dates and numbers.
---

# GiveAgain content and formats

The site is **English only**. No translation system, no language switcher, no Dzongkha. Tone and design are in `giveagain` and `giveagain-ui`.

## Copy

- Plain, warm, short, friendly. Write for neighbors, not for a tech company. No jargon, idioms or jokes.
- **Free-only wording:** never "buy", "price", "sell", "cost", "deal". Use "give away", "ask for it", "free", "pick up".
- Buttons: "Give something away", "Ask for it — free", "Save", "Report". Say what happens ("Send request"), not "Submit".
- Errors say what to do, not what went wrong technically: "Choose where the item can be collected." Never show raw server or database messages.
- Empty states are helpful and kind ("No giveaways here yet. Be the first to give something away.").
- Keep text in one place per component/feature (constants or the component's props), never scattered as duplicated literals. Shared inputs get `label` and `error` from props (`giveagain-ui`).
- Server errors return tRPC codes with short safe messages; the UI shows friendly text for each code.

## Formats (Bhutan)

- Store times in UTC; display in **Asia/Thimphu** (UTC+6) using `Intl.DateTimeFormat`. Relative times ("2 hours ago", "Yesterday") from one helper in `lib/format.ts`.
- Phone display from E.164 (+975…); validation in `giveagain-security`.
- No currency anywhere. Numbers with `Intl.NumberFormat`.
- Dzongkhags, categories, conditions and statuses are constants with a stable key plus an English label. Store the **key** in the database, show the label.
- Allow long user text in cards and buttons without breaking layout (wrap or clamp with an ellipsis, never clip silently).

## Tests

Cover: no price/sell wording in user-facing text (grep in review), dates render in Asia/Thimphu, relative-time helper edge cases, error codes map to friendly messages.
