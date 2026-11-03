import { authActions } from "@/lib/auth-actions";
import { friendlyError, trpc } from "@/lib/trpc-client";
import type { ProfileOutput } from "@/schemas/profile";

const pause = () => new Promise((resolve) => setTimeout(resolve, 500));
const run = (call: Promise<unknown>) => call.then(() => undefined, (e) => { throw friendlyError(e); });

export const accountActions = {
  // Not connected yet: the profile fields (phone, place, about, settings) aren't stored.
  async saveProfile(values: ProfileOutput) {
    void values;
    await pause();
  },
  async deleteAccount() {
    await pause();
  },
  signOut: authActions.signOut,
  answerRequest: (requestId: string, answer: "accepted" | "declined") => run(trpc.booking.answer.mutate({ id: requestId, answer })),
  markGiven: (listingId: string) => run(trpc.listing.markGiven.mutate({ id: listingId })),
  withdrawListing: (listingId: string) => run(trpc.listing.withdraw.mutate({ id: listingId })),
  cancelBooking: (bookingId: string) => run(trpc.booking.cancel.mutate({ id: bookingId })),
};
