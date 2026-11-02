import { z } from "zod";
import { DZONGKHAGS } from "@/constants/location";
import { phoneSchema } from "@/lib/phone";

export const profileSchema = z.object({
  photo: z.instanceof(File).nullable(),
  firstName: z.string().trim().min(2, "Enter your first name.").max(30, "Keep it under 30 characters."),
  lastInitial: z.string().trim().regex(/^\p{L}$/u, "Add one letter."),
  about: z.string().trim().max(160, "Keep it under 160 characters."),
  dzongkhag: z.enum(DZONGKHAGS, "Choose where you live."),
  phone: phoneSchema.or(z.literal("")),
  notify: z.object({ requests: z.boolean(), answers: z.boolean(), nearby: z.boolean(), weekly: z.boolean() }),
  privacy: z.object({ firstNameOnly: z.boolean(), showGiven: z.boolean() }),
});

export type ProfileInput = z.input<typeof profileSchema>;
export type ProfileOutput = z.output<typeof profileSchema>;
