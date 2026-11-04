import { TRPCError } from "@trpc/server";
import { serverCaller } from "@/server/caller";
import type { MyBooking, MyListing } from "@/types/account";

/** How many requests are waiting for the giver's answer (for the menu badge). */
export async function getOpenRequestCount(): Promise<number> {
  return (await serverCaller()).account.openRequestCount();
}

/** Account data for pages. Everything is scoped to the signed-in user by the API. */
export async function getMyListings(): Promise<MyListing[]> {
  return (await serverCaller()).account.myListings();
}

export async function getMyBookings(): Promise<MyBooking[]> {
  return (await serverCaller()).account.myBookings();
}

async function orNull<T>(load: Promise<T>): Promise<T | undefined> {
  try {
    return await load;
  } catch (error) {
    if (error instanceof TRPCError && (error.code === "NOT_FOUND" || error.code === "BAD_REQUEST")) return undefined;
    throw error;
  }
}

export async function getMyListing(id: string): Promise<MyListing | undefined> {
  return orNull((await serverCaller()).account.myListing({ id }));
}

export async function getMyBooking(id: string): Promise<MyBooking | undefined> {
  return orNull((await serverCaller()).account.myBooking({ id }));
}

export function countOpenRequests(listings: MyListing[]): number {
  return listings.reduce((total, item) => total + item.requests.filter((r) => r.status === "requested").length, 0);
}
