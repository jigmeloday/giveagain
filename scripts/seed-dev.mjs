// Fills the DEV database with fake people and listings so the site has something to show.
// Safe to run twice.
//   Local database:  node --env-file=.env.local scripts/seed-dev.mjs
//     Adds an admin and two users (password "password1234") and sample listings.
//   Any other database (e.g. Neon):  ... scripts/seed-dev.mjs --remote
//     Adds sample listings owned by fake people who CANNOT sign in (no password), tagged @example.invalid.
//     Never creates a login. Undo with:  ... scripts/seed-dev.mjs --remote --remove
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import pg from "pg";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("Set DATABASE_URL.");
const remote = process.argv.includes("--remote");
const remove = process.argv.includes("--remove");
const isLocal = ["localhost", "127.0.0.1"].includes(new URL(url).hostname);
if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed in production.");
if (!isLocal && !remote) {
  throw new Error("This is not a local database, so the normal seed is refused (it makes accounts with a known password).\nTo add sample listings anyway, run: npm run db:seed:remote\nTo remove them later: npm run db:seed:remove");
}
if (remove && isLocal && !remote) throw new Error("--remove is for the remote sample data. Use it with --remote.");

const SAMPLE_DOMAIN = "@example.invalid";

const PASSWORD = "password1234";
const PEOPLE = [
  { email: "admin@example.com", name: "Admin Volunteer", role: "admin" },
  { email: "pema@example.com", name: "Pema Dorji", role: "user" },
  { email: "karma@example.com", name: "Karma Wangmo", role: "user" },
];

// Remote mode: fake owners with no password and no login, so nobody can sign in as them.
const REMOTE_PEOPLE = [
  { email: `sample-pema${SAMPLE_DOMAIN}`, name: "Pema Dorji", role: "user" },
  { email: `sample-karma${SAMPLE_DOMAIN}`, name: "Karma Wangmo", role: "user" },
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

if (remove) {
  const sample = (await pool.query(`SELECT id FROM "user" WHERE email LIKE $1`, [`%${SAMPLE_DOMAIN}`])).rows.map((r) => r.id);
  await pool.query(`DELETE FROM booking WHERE requester_id = ANY($1) OR listing_id IN (SELECT id FROM listing WHERE owner_id = ANY($1))`, [sample]);
  const listings = await pool.query(`DELETE FROM listing WHERE owner_id = ANY($1)`, [sample]);
  const users = await pool.query(`DELETE FROM "user" WHERE id = ANY($1)`, [sample]);
  console.log(`Removed ${listings.rowCount} sample listings and ${users.rowCount} sample people (only ${SAMPLE_DOMAIN} accounts were touched).`);
  await pool.end();
  process.exit(0);
}

const hash = remote ? null : await hashPassword(PASSWORD);
const ids = {};

if (remote) {
  for (const p of REMOTE_PEOPLE) {
    const found = await pool.query(`SELECT id FROM "user" WHERE email = $1`, [p.email]);
    if (found.rows[0]) { ids[p.email] = found.rows[0].id; continue; }
    const id = randomUUID();
    ids[p.email] = id;
    await pool.query(`INSERT INTO "user" (id, name, email, "emailVerified", role) VALUES ($1, $2, $3, true, $4)`, [id, p.name, p.email, p.role]);
  }
}

for (const p of remote ? [] : PEOPLE) {
  const found = await pool.query(`SELECT id FROM "user" WHERE email = $1`, [p.email]);
  if (found.rows[0]) { ids[p.email] = found.rows[0].id; continue; }
  const id = randomUUID();
  ids[p.email] = id;
  await pool.query(`INSERT INTO "user" (id, name, email, "emailVerified", role) VALUES ($1, $2, $3, true, $4)`, [id, p.name, p.email, p.role]);
  await pool.query(`INSERT INTO account (id, "accountId", "providerId", "userId", password, "updatedAt") VALUES ($1, $2, 'credential', $2, $3, now())`, [randomUUID(), id, hash]);
}

// Local: only seed an empty database. Remote: only add the sample listings once, and leave real listings alone.
const existing = remote
  ? (await pool.query(`SELECT count(*)::int AS n FROM listing WHERE owner_id = ANY($1)`, [Object.values(ids)])).rows[0].n
  : (await pool.query(`SELECT count(*)::int AS n FROM listing`)).rows[0].n;
const adminId = remote ? (await pool.query(`SELECT id FROM "user" WHERE role = 'admin' ORDER BY "createdAt" LIMIT 1`)).rows[0]?.id ?? null : ids["admin@example.com"];
if (existing === 0) {
  for (const l of LISTINGS) {
    const owner = remote ? { "pema@example.com": REMOTE_PEOPLE[0].email, "karma@example.com": REMOTE_PEOPLE[1].email }[l.owner] : l.owner;
    const reviewed = l.status !== "pending";
    await pool.query(
      `INSERT INTO listing (owner_id, title, description, category, condition, dzongkhag, area, status, created_at, moderated_by, moderated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now() - make_interval(hours => $9), $10, $11)`,
      [ids[owner], l.title, l.description, l.category, l.condition, l.dzongkhag, l.area, l.status, l.hoursAgo, reviewed ? adminId : null, reviewed ? new Date() : null],
    );
  }
}

console.log(
  remote
    ? `Added ${existing === 0 ? LISTINGS.length : 0} sample listings owned by fake people who can't sign in (${REMOTE_PEOPLE.map((p) => p.email).join(", ")}).\nRemove them any time with: npm run db:seed:remove`
    : `Seeded. Sign in with any of these emails and the password "${PASSWORD}":\n  ${PEOPLE.map((p) => `${p.email} (${p.role})`).join("\n  ")}`,
);
await pool.end();
