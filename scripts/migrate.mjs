// Applies db/migrations/*.sql in order, each in its own transaction, and remembers what ran.
// Forward-only: never edit a migration that has been applied, add a new one.
// Usage: node --env-file=.env.local scripts/migrate.mjs [--test]
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");

export async function migrate(connectionString) {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    const done = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
    const applied = [];
    for (const file of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
      if (done.has(file)) continue;
      await client.query("BEGIN");
      try {
        await client.query(await readFile(path.join(dir, file), "utf8"));
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        applied.push(file);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${error.message}`);
      }
    }
    return applied;
  } finally {
    await client.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const url = process.argv.includes("--test") ? process.env.TEST_DATABASE_URL : (process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);
  if (!url) throw new Error("Set DATABASE_URL (or TEST_DATABASE_URL with --test).");
  const applied = await migrate(url);
  console.log(applied.length ? `Applied: ${applied.join(", ")}` : "Nothing to apply.");
}
