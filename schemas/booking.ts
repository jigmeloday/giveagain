import { z } from "zod";
import { phoneSchema } from "@/lib/phone";

/** What a seeker sends when asking for an item. */
export const requestSchema = z.strictObject({
  phone: phoneSchema,
  note: z.string().trim().max(300, "Keep it under 300 characters."),
});

export type RequestInput = z.input<typeof requestSchema>;
export type RequestOutput = z.output<typeof requestSchema>;
