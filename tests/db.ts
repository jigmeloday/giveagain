import pg from "pg";

const url = process.env.TEST_DATABASE_URL;
if (!url) throw new Error("Set TEST_DATABASE_URL to a throwaway database (see .env.example).");
if (!/test/i.test(new URL(url).pathname)) throw new Error("TEST_DATABASE_URL must point at a database with 'test' in its name.");

/** Direct connection for setting up and checking data. */
export const testDb = new pg.Pool({ connectionString: url, max: 3 });

const TABLES = ["audit_log", "report", "booking", "listing_photo", "listing", "session", "account", "verification", '"user"'];

/** Empties every table. Call in beforeEach so each test starts clean. */
export async function resetDb() {
  await testDb.query(`TRUNCATE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`);
}
