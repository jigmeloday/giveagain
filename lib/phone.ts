import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { z } from "zod";

const util = PhoneNumberUtil.getInstance();

/** E.164 (e.g. +97517123456) for a valid Bhutan number, or null. Numbers from other countries are rejected. */
export function toE164(input: string): string | null {
  try {
    const parsed = util.parse(input, "BT");
    const isBhutanese = util.isValidNumber(parsed) && util.getRegionCodeForNumber(parsed) === "BT";
    return isBhutanese ? util.format(parsed, PhoneNumberFormat.E164) : null;
  } catch {
    return null;
  }
}

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Enter your phone number.")
  .max(30, "That phone number is too long.")
  .refine((value) => toE164(value) !== null, "Enter a valid phone number, like 17 12 34 56.")
  .transform((value) => toE164(value) as string);
