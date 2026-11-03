import { loadEnv } from "vite";
import { migrate } from "../scripts/migrate.mjs";

/** Brings the test database up to date once, before any test file runs. */
export default async function setup() {
  const url = loadEnv("test", process.cwd(), "").TEST_DATABASE_URL;
  if (!url) {
    console.warn("TEST_DATABASE_URL is not set: backend tests will fail. See .env.example.");
    return;
  }
  await migrate(url);
}
