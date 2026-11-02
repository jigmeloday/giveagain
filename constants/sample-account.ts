import type { MyBooking, MyListing, User } from "@/types/account";

/** Sample data until the account comes from the API. */
export const SAMPLE_USER: User = {
  id: "u1",
  firstName: "Pema",
  lastInitial: "D",
  about: "Clearing out after a move. Happy to help carry big things to the door.",
  email: "pema@example.com",
  phone: "+97517123456",
  dzongkhag: "Thimphu",
  settings: {
    notify: { requests: true, answers: true, nearby: true, weekly: false },
    privacy: { firstNameOnly: true, showGiven: true },
  },
};

export const SAMPLE_MY_LISTINGS: MyListing[] = [
  {
    id: "1", name: "Three-seat sofa", category: "Furniture", area: "Motithang", dzongkhag: "Thimphu", postedAt: "2026-11-02T04:00:00Z", status: "available",
    requests: [
      { id: "r1", name: "Karma Wangmo", phone: "+97517998877", note: "I have a truck and can come this weekend.", status: "requested", requestedAt: "2026-11-02T08:00:00Z" },
      { id: "r2", name: "Sonam Tenzin", phone: "+97577112233", status: "requested", requestedAt: "2026-11-02T09:30:00Z" },
    ],
  },
  {
    id: "5", name: "Study desk", category: "Furniture", area: "Khuruthang", dzongkhag: "Punakha", postedAt: "2026-10-30T06:00:00Z", status: "reserved",
    requests: [{ id: "r3", name: "Dechen Pelden", phone: "+97517445566", note: "For my daughter's homework.", status: "accepted", requestedAt: "2026-10-31T06:00:00Z" }],
  },
  { id: "9", name: "Winter jackets", category: "Clothing", area: "Chamkhar", dzongkhag: "Bumthang", postedAt: "2026-11-02T10:00:00Z", status: "pending", requests: [] },
  { id: "10", name: "Old bookshelf", category: "Furniture", area: "Babesa", dzongkhag: "Thimphu", postedAt: "2026-10-12T06:00:00Z", status: "given", requests: [] },
  { id: "11", name: "Table fan", category: "Electronics", area: "Babesa", dzongkhag: "Thimphu", postedAt: "2026-10-20T06:00:00Z", status: "rejected", rejectionReason: "Please add a clearer photo of the whole fan.", requests: [] },
];

export const SAMPLE_MY_BOOKINGS: MyBooking[] = [
  { id: "b1", itemId: "6", itemName: "Baby stroller", area: "Babesa", dzongkhag: "Thimphu", status: "requested", requestedAt: "2026-11-01T06:00:00Z" },
  { id: "b2", itemId: "8", itemName: "Cooking pots set", area: "Mongar town", dzongkhag: "Mongar", status: "accepted", requestedAt: "2026-10-26T06:00:00Z", giverPhone: "+97517765432", pickupNote: "Near the hospital, blue gate. Call when you arrive." },
  { id: "b3", itemId: "3", itemName: "Rice cooker", area: "Phuentsholing", dzongkhag: "Chhukha", status: "declined", requestedAt: "2026-10-28T06:00:00Z" },
];
