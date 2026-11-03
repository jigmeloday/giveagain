import "server-only";
import { betterAuth } from "better-auth";
import { authOptions } from "@/lib/auth-options";
import { env } from "@/lib/env";
import { pool } from "@/server/db";

export const auth = betterAuth({
  ...authOptions(pool),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});
