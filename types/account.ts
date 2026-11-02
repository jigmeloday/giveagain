import type { Listing } from "@/types/listing";

export type ListingStatus = "pending" | "available" | "reserved" | "given" | "rejected" | "withdrawn";
export type BookingStatus = "requested" | "accepted" | "declined" | "cancelled";

export type UserSettings = {
  notify: { requests: boolean; answers: boolean; nearby: boolean; weekly: boolean };
  privacy: { firstNameOnly: boolean; showGiven: boolean };
};

export type User = {
  id: string;
  firstName: string;
  /** One letter, shown after the first name. */
  lastInitial: string;
  about: string;
  email: string;
  /** E.164, e.g. "+97517123456". Empty if not added. */
  phone: string;
  dzongkhag: string;
  settings: UserSettings;
};

/** A seeker's request, as the giver sees it. */
export type BookingRequest = {
  id: string;
  name: string;
  phone: string;
  note?: string;
  status: BookingStatus;
  requestedAt: string;
};

export type MyListing = Pick<Listing, "id" | "name" | "category" | "area" | "dzongkhag" | "postedAt"> & {
  status: ListingStatus;
  /** Shown when an admin rejected the listing. */
  rejectionReason?: string;
  requests: BookingRequest[];
};

/** A request the user made for someone else's item. */
export type MyBooking = {
  id: string;
  itemId: string;
  itemName: string;
  area: string;
  dzongkhag: string;
  status: BookingStatus;
  requestedAt: string;
  /** Only present once the giver accepted. */
  giverPhone?: string;
  pickupNote?: string;
};
