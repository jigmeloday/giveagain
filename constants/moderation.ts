export const REJECTION_REASONS: { value: RejectionReason; label: string }[] = [
  { value: "prohibited_item", label: "Not allowed on GiveAgain" },
  { value: "selling_or_price", label: "It mentions a price or selling" },
  { value: "unclear_photos", label: "The photos are unclear" },
  { value: "not_enough_detail", label: "It needs more detail" },
  { value: "unsafe_item", label: "It might be unsafe" },
  { value: "other", label: "Something else" },
];

export const REJECTION_REASON_VALUES = ["prohibited_item", "selling_or_price", "unclear_photos", "not_enough_detail", "unsafe_item", "other"] as const;

export type RejectionReason = (typeof REJECTION_REASON_VALUES)[number];

/** Kind wording shown to the owner for each reason. */
export const REJECTION_MESSAGES: Record<RejectionReason, string> = {
  prohibited_item: "We can't list this item on GiveAgain. Please read what is not allowed on the How it works page.",
  selling_or_price: "Everything on GiveAgain is free. Please remove any price or mention of selling, then post again.",
  unclear_photos: "Please add clearer photos in daylight showing the whole item.",
  not_enough_detail: "Please tell neighbours a little more about the item, like its size and any marks.",
  unsafe_item: "We can't list this item because it might not be safe to give away.",
  other: "Our team could not approve this post. Please check the note and post again.",
};
