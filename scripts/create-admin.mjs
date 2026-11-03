// Creates the first admin account. Admins can only be made here (or by another admin tool), never from the website.
// Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long password' [ADMIN_NAME='Your Name'] \
//        node --env-file=.env.local scripts/create-admin.mjs
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import pg from "pg";

const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password, ADMIN_NAME: name = "Admin Volunteer" } = process.env;
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) throw new Error("Set DATABASE_URL.");
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Set ADMIN_EMAIL to a valid email.");
if (!password || password.length < 12) throw new Error("Set ADMIN_PASSWORD to at least 12 characters.");

const pool = new pg.Pool({ connectionString: url, max: 1 });
try {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if ((await client.query(`SELECT 1 FROM "user" WHERE email = $1`, [email.toLowerCase()])).rowCount) {
      throw new Error("That email already has an account. Nothing was changed.");
    }
    const id = randomUUID();
    await client.query(`INSERT INTO "user" (id, name, email, "emailVerified", role) VALUES ($1, $2, $3, true, 'admin')`, [id, name, email.toLowerCase()]);
    await client.query(
      `INSERT INTO account (id, "accountId", "providerId", "userId", password, "updatedAt") VALUES ($1, $2, 'credential', $2, $3, now())`,
      [randomUUID(), id, await hashPassword(password)],
    );
    await client.query("COMMIT");
    console.log(`Created admin ${email.toLowerCase()}.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
