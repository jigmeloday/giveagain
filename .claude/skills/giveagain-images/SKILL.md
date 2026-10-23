---
name: giveagain-images
description: Photo upload, processing, storage and display rules for GiveAgain listings. Use whenever working on image upload, listing photos, galleries, item cards, thumbnails, or next/image usage.
---

# GiveAgain images

Photos make or break a giveaway, and they are the heaviest thing on slow mobile networks. Security rules for uploads are in `giveagain-security`; display rules in `giveagain-ui`.

## What we want

- Real daylight photos of the actual item, whole item first. 1–6 photos per listing (cap enforced on the server), the first is the cover.
- Square cover crop on cards; the original aspect ratio in the gallery.

## Upload flow

1. Client picks photos and **compresses and resizes in the browser** before upload (max ~1600px on the long side, quality ~80%) to save the user's data and time. Show previews and progress; allow remove and reorder.
2. Client asks the server for a **short-lived signed upload URL** per file (protected procedure, rate-limited, scoped to the user, file type/size declared and enforced).
3. Client uploads straight to storage (not through our server) and then attaches the photo keys to the listing via tRPC. The server verifies the key belongs to this user and was uploaded.
4. Server-side processing (async, off the request path): verify real file type by content, **strip EXIF** (GPS!), re-encode to **WebP**, create sizes **480 / 960 / 1440 px**, store width/height and a tiny blur placeholder.
5. Listing shows a processing state until variants exist; never block the user's form on processing.

## Limits and validation

- Allowed: JPEG, PNG, WebP (and HEIC if converted on the client or server). Checked by magic bytes, not extension.
- Max file size on upload (e.g. 8 MB raw, before client compression), max photos per listing, max pixel dimensions (reject decompression bombs).
- Random server-generated keys; never user-supplied file names or paths.
- Orphan cleanup: a scheduled job deletes uploaded files never attached to a listing, and files of deleted listings.

## Storage and delivery

- Private upload area; public read only for processed variants of **approved** listings (pending photos aren't publicly reachable).
- Serve through a CDN with long-lived immutable caching (`Cache-Control: public, max-age=31536000, immutable`, keys include a content hash) and `X-Content-Type-Options: nosniff`.
- Storage provider is **not decided yet** (candidates: Neon object storage, S3-compatible, Cloudflare R2). Ask the user before choosing; keep access behind one `lib/storage.ts` interface so it can change.

## Display

- Always `next/image` with correct `sizes`, WebP, `width`/`height` set (no layout shift), lazy-loaded behind a grey placeholder or blur; `priority` only for the first above-the-fold image.
- Item cards use the 480 variant; detail gallery 960 (1440 on large screens/zoom) in a Swiper carousel (`giveagain-ui`).
- Meaningful `alt` (the item name, e.g. "Wooden study desk, front view"), never empty for item photos.
- Show a clear placeholder when a listing has no photo yet or processing failed.

## Tests (required)

Cover: wrong type or oversized file rejected; type verified by content; too many photos rejected; signed URL only for signed-in users and scoped; another user's key can't be attached; EXIF/GPS removed from output; pending listing photos not public; orphan cleanup; component shows placeholder, alt text and no layout shift props.
