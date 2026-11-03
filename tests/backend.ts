import { afterAll, beforeEach } from "vitest";
import { pool } from "@/server/db";
import { resetDb, testDb } from "./db";

/** Shared setup for backend test files: a clean database for every test, and connections closed at the end. */
export function withCleanDb() {
  beforeEach(resetDb);
  afterAll(async () => {
    await pool.end();
    await testDb.end();
  });
}
