import { z } from "zod";
import { CATEGORIES, CONDITIONS } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import { MAX_LISTING_PHOTOS, MIN_LISTING_PHOTOS } from "@/constants/images";
import { phoneSchema } from "@/lib/phone";

export const giveListingSchema = z.object({
  title: z.string().trim().min(3, "Give the item a short name.").max(80, "Keep the name under 80 characters."),
  category: z.enum(CATEGORIES, "Choose a category."),
  size: z.string().trim().max(60, "Keep it under 60 characters."),
  dzongkhag: z.enum(DZONGKHAGS, "Choose where the item can be collected."),
  area: z.string().trim().min(2, "Add the area or neighbourhood, like Motithang.").max(60, "Keep it under 60 characters."),
  collection: z.string().trim().max(80, "Keep it under 80 characters."),
  headsUp: z.string().trim().max(80, "Keep it under 80 characters."),
  condition: z.enum(CONDITIONS, "Choose the condition."),
  description: z.string().trim().min(10, "Tell people a little more, at least 10 characters.").max(500, "Keep it under 500 characters."),
  phone: phoneSchema,
  photos: z.array(z.instanceof(File)).min(MIN_LISTING_PHOTOS, `Add at least ${MIN_LISTING_PHOTOS} photos.`).max(MAX_LISTING_PHOTOS),
  agree: z.boolean().refine((value) => value, "Please confirm the item is free to take."),
});

export type GiveListingInput = z.input<typeof giveListingSchema>;
export type GiveListingOutput = z.output<typeof giveListingSchema>;
