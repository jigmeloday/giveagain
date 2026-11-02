import { SAMPLE_MY_BOOKINGS, SAMPLE_MY_LISTINGS } from "@/constants/sample-account";
import type { MyBooking, MyListing } from "@/types/account";

/** Account data access. Swap for the protected tRPC queries once the API exists. */
export async function getMyListings(): Promise<MyListing[]> {
  return SAMPLE_MY_LISTINGS;
}

export async function getMyListing(id: string): Promise<MyListing | undefined> {
  return SAMPLE_MY_LISTINGS.find((listing) => listing.id === id);
}

export async function getMyBookings(): Promise<MyBooking[]> {
  return SAMPLE_MY_BOOKINGS;
}

export function countOpenRequests(listings: MyListing[]): number {
  return listings.reduce((total, item) => total + item.requests.filter((r) => r.status === "requested").length, 0);
}

export async function getMyBooking(id: string): Promise<MyBooking | undefined> {
  return SAMPLE_MY_BOOKINGS.find((booking) => booking.id === id);
}
