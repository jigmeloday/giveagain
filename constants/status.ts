import type { BookingStatus, ListingStatus } from "@/types/account";

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  pending: "Being checked",
  available: "Available",
  reserved: "Reserved",
  given: "Given",
  rejected: "Not approved",
  withdrawn: "Withdrawn",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  requested: "Waiting for the giver",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled",
};

export type StatusTone = "good" | "wait" | "quiet" | "bad";

export const LISTING_STATUS_TONES: Record<ListingStatus, StatusTone> = {
  pending: "wait",
  available: "good",
  reserved: "wait",
  given: "quiet",
  rejected: "bad",
  withdrawn: "quiet",
};

export const BOOKING_STATUS_TONES: Record<BookingStatus, StatusTone> = {
  requested: "wait",
  accepted: "good",
  declined: "quiet",
  cancelled: "quiet",
};

/** One plain sentence under each status, saying what is happening and what to do. */
export const LISTING_STATUS_HELP: Record<ListingStatus, string> = {
  pending: "Our team is checking your post. This usually takes a day. Nothing to do for now.",
  available: "Everyone can see this. When someone asks for it, you will see them below.",
  reserved: "You chose someone. Call them to agree when to meet.",
  given: "You gave this away. Thank you!",
  rejected: "We could not put this online. Read the note below, then post it again.",
  withdrawn: "You took this down. It is no longer shown.",
};

export const BOOKING_STATUS_HELP: Record<BookingStatus, string> = {
  requested: "The giver has your phone number. They will call you if they choose you.",
  accepted: "Good news! You can collect this. Call the giver to agree a time.",
  declined: "The giver chose someone else this time. There are many more free things to find.",
  cancelled: "You cancelled this request.",
};
