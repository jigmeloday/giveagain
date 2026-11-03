import { friendlyError, trpc } from "@/lib/trpc-client";
import { uploadPhotos } from "@/lib/upload-photos";
import type { GiveListingOutput } from "@/schemas/listing";

export const listingActions = {
  /** Uploads the photos, then posts the listing for review. */
  async create({ photos, ...values }: GiveListingOutput) {
    const stored = await uploadPhotos(photos);
    await trpc.listing.create.mutate({ ...values, photos: stored }).catch((e) => { throw friendlyError(e); });
  },
};
