import { randomUUID } from "node:crypto";
import { testDb } from "./db";
import type { SessionUser } from "@/server/trpc";

type UserOverrides = Partial<SessionUser> & { email?: string };

export async function makeUser(overrides: UserOverrides = {}): Promise<SessionUser> {
  const id = overrides.id ?? randomUUID();
  const user: SessionUser = { id, name: overrides.name ?? "Test User", role: overrides.role ?? "user", banned: overrides.banned ?? false };
  await testDb.query(
    `INSERT INTO "user" (id, name, email, "emailVerified", role, banned) VALUES ($1, $2, $3, true, $4, $5)`,
    [user.id, user.name, overrides.email ?? `${id}@example.com`, user.role, user.banned],
  );
  return user;
}

type ListingOverrides = Partial<{
  title: string; description: string; category: string; condition: string; dzongkhag: string; area: string;
  status: string; createdAt: string; rejectionReason: string; photos: string[]; deletedAt: string;
  contactPhone: string; addressPrivate: string;
}>;

export async function makeListing(ownerId: string, overrides: ListingOverrides = {}): Promise<string> {
  const { rows } = await testDb.query(
    `INSERT INTO listing (owner_id, title, description, category, condition, dzongkhag, area, status, rejection_reason, created_at, deleted_at, contact_phone, address_private)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10::timestamptz, now()), $11, $12, $13) RETURNING id`,
    [
      ownerId, overrides.title ?? "Three-seat sofa", overrides.description ?? "Grey sofa, a few marks on one arm.",
      overrides.category ?? "Furniture", overrides.condition ?? "Good", overrides.dzongkhag ?? "Thimphu", overrides.area ?? "Motithang",
      overrides.status ?? "pending", overrides.rejectionReason ?? null, overrides.createdAt ?? null, overrides.deletedAt ?? null,
      overrides.contactPhone ?? "+97517123456", overrides.addressPrivate ?? null,
    ],
  );
  const id: string = rows[0].id;
  for (const [position, key] of (overrides.photos ?? []).entries()) {
    await testDb.query(`INSERT INTO listing_photo (listing_id, key, position) VALUES ($1, $2, $3)`, [id, key, position]);
  }
  return id;
}

export async function makeBooking(listingId: string, requesterId: string, overrides: Partial<{ status: string; phone: string; note: string }> = {}): Promise<string> {
  const { rows } = await testDb.query(
    `INSERT INTO booking (listing_id, requester_id, phone, note, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [listingId, requesterId, overrides.phone ?? "+97517999999", overrides.note ?? null, overrides.status ?? "requested"],
  );
  return rows[0].id;
}
