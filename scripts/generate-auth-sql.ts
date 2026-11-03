// One-off helper: prints the SQL Better Auth needs for our config. Run when the auth config changes,
// then save the output as a new migration. Usage: node --env-file=.env.local scripts/generate-auth-sql.ts
import { getMigrations } from "better-auth/db/migration";
import pg from "pg";
import { authOptions } from "../lib/auth-options.ts";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const { compileMigrations } = await getMigrations({ ...authOptions(pool), secret: "x".repeat(32), baseURL: "http://localhost:3000" });
console.log(await compileMigrations());
await pool.end();
