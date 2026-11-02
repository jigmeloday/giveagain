import type { GiveListingOutput } from "@/schemas/listing";

/**
 * Stand-in for the create-listing tRPC mutation. Should throw an Error with a short,
 * friendly message on failure. Replace the body once the API exists.
 */
export const listingActions = {
  async create(values: GiveListingOutput) {
    void values;
    await new Promise((resolve) => setTimeout(resolve, 800));
  },
};
