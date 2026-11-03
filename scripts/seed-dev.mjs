// Fills the DEV database with fake people and listings so the site has something to show.
// Safe to run twice. Refuses to run against anything but a local database.
// Usage: node --env-file=.env.local scripts/seed-dev.mjs
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Set DATABASE_URL.");
if (process.env.NODE_ENV === "production" || !["localhost", "127.0.0.1"].includes(new URL(url).hostname)) {
  throw new Error("Refusing to seed: this only runs against a local database.");
}

const PASSWORD = "password1234";
const PEOPLE = [
  { email: "admin@example.com", name: "Admin Volunteer", role: "admin" },
  { email: "pema@example.com", name: "Pema Dorji", role: "user" },
  { email: "karma@example.com", name: "Karma Wangmo", role: "user" },
];

const LISTINGS = [
  { owner: "pema@example.com", title: "Three-seat sofa", description: "Grey fabric sofa, a few small marks on one arm. Very comfortable.", category: "Furniture", condition: "Good", dzongkhag: "Thimphu", area: "Motithang", status: "pending", hoursAgo: 30 },
  { owner: "pema@example.com", title: "Kids' storybooks (20)", description: "Twenty picture books in English, ages 3 to 8. Hardly read.", category: "Books", condition: "Like new", dzongkhag: "Paro", area: "Paro town", status: "pending", hoursAgo: 5 },
  { owner: "karma@example.com", title: "Rice cooker", description: "Works well, 1.8 litre. The lid handle is a little loose.", category: "Kitchen", condition: "Fair", dzongkhag: "Chhukha", area: "Phuentsholing", status: "pending", hoursAgo: 2 },
  { owner: "karma@example.com", title: "Winter jackets", description: "Three adult jackets, sizes M and L. Washed and ready to wear.", category: "Clothing", condition: "Good", dzongkhag: "Bumthang", area: "Chamkhar", status: "available", hoursAgo: 48 },
  { owner: "pema@example.com", title: "Study desk", description: "Wooden desk with one drawer. Solid, just has some pen marks.", category: "Furniture", condition: "Good", dzongkhag: "Punakha", area: "Khuruthang", status: "reserved", hoursAgo: 72 },
  { owner: "pema@example.com", title: "Old bookshelf", description: "Tall wooden bookshelf, five shelves, needs a wipe.", category: "Furniture", condition: "Fair", dzongkhag: "Thimphu", area: "Babesa", status: "given", hoursAgo: 240 },
];

const pool = new pg.Pool({ connectionString: url });
const hash = await hashPassword(PASSWORD);
const ids = {};

for (const p of PEOPLE) {
  const found = await pool.query(`SELECT id FROM "user" WHERE email = $1`, [p.email]);
  if (found.rows[0]) { ids[p.email] = found.rows[0].id; continue; }
  const id = randomUUID();
  ids[p.email] = id;
  await pool.query(`INSERT INTO "user" (id, name, email, "emailVerified", role) VALUES ($1, $2, $3, true, $4)`, [id, p.name, p.email, p.role]);
  await pool.query(`INSERT INTO account (id, "accountId", "providerId", "userId", password, "updatedAt") VALUES ($1, $2, 'credential', $2, $3, now())`, [randomUUID(), id, hash]);
}

const existing = (await pool.query(`SELECT count(*)::int AS n FROM listing`)).rows[0].n;
if (existing === 0) {
  for (const l of LISTINGS) {
    const reviewed = l.status !== "pending";
    await pool.query(
      `INSERT INTO listing (owner_id, title, description, category, condition, dzongkhag, area, status, created_at, moderated_by, moderated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now() - make_interval(hours => $9), $10, $11)`,
      [ids[l.owner], l.title, l.description, l.category, l.condition, l.dzongkhag, l.area, l.status, l.hoursAgo, reviewed ? ids["admin@example.com"] : null, reviewed ? new Date() : null],
    );
  }
}

console.log(`Seeded. Sign in with any of these emails and the password "${PASSWORD}":\n  ${PEOPLE.map((p) => `${p.email} (${p.role})`).join("\n  ")}`);
await pool.end();
