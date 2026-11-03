import "server-only";
import pg from "pg";
import { env } from "@/lib/env";

const globalForDb = globalThis as unknown as { pool?: pg.Pool };

/** One shared pool, kept across hot reloads in development. */
export const pool = (globalForDb.pool ??= new pg.Pool({ connectionString: env.DATABASE_URL, max: 10 }));

export type Queryable = Pick<pg.Pool, "query">;

/** Runs several queries as one all-or-nothing change. */
export async function withTransaction<T>(work: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
