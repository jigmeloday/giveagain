import "server-only";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_UNPOOLED: z.string().min(1).optional(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
});

export const env = schema.parse(process.env);
