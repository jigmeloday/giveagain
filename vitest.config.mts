import path from "node:path";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const env = loadEnv("test", process.cwd(), "");

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    // `server-only` throws outside Next's server build; tests run on the server, so it's a no-op here.
    alias: { "server-only": path.resolve(import.meta.dirname, "tests/server-only.ts") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globalSetup: ["./tests/global-setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "e2e", ".next"],
    // Backend tests share one test database, so files run one after another.
    fileParallelism: false,
    // The app code under test only ever sees the TEST database.
    env: {
      DATABASE_URL: env.TEST_DATABASE_URL ?? "",
      TEST_DATABASE_URL: env.TEST_DATABASE_URL ?? "",
      BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET ?? "test-secret-test-secret-test-secret-0",
      BETTER_AUTH_URL: env.BETTER_AUTH_URL ?? "http://localhost:3000",
    },
  },
});
