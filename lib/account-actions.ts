import type { ProfileOutput } from "@/schemas/profile";

/**
 * Stand-ins for the protected tRPC mutations. Each should throw an Error with a short,
 * friendly message on failure. Replace the bodies once the API exists.
 */
const pause = () => new Promise((resolve) => setTimeout(resolve, 500));

export const accountActions = {
  async saveProfile(values: ProfileOutput) {
    void values;
    await pause();
  },
  async deleteAccount() {
    await pause();
  },
  async signOut() {
    await pause();
  },
  async answerRequest(requestId: string, answer: "accepted" | "declined") {
    void requestId;
    void answer;
    await pause();
  },
  async markGiven(listingId: string) {
    void listingId;
    await pause();
  },
  async withdrawListing(listingId: string) {
    void listingId;
    await pause();
  },
  async cancelBooking(bookingId: string) {
    void bookingId;
    await pause();
  },
};
