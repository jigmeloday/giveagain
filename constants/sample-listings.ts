import type { Listing } from "@/types/listing";

/** Sample data until listings come from the API. */
export const SAMPLE_LISTINGS: Listing[] = [
  { id: "1", name: "Three-seat sofa", description: "Grey fabric sofa, a few small marks on one arm. Very comfortable. You will need a pickup truck.", category: "Furniture", condition: "Good", dzongkhag: "Thimphu", area: "Motithang", postedAt: "2026-11-02T04:00:00Z", status: "available" },
  { id: "2", name: "Kids' storybooks (20)", description: "Twenty picture books in English, ages 3 to 8. Kept on a shelf, hardly read.", category: "Books", condition: "Like new", dzongkhag: "Paro", area: "Paro town", postedAt: "2026-11-02T01:00:00Z", status: "available" },
  { id: "3", name: "Rice cooker", description: "Works well, 1.8 litre. The lid handle is a little loose.", category: "Kitchen", condition: "Fair", dzongkhag: "Chhukha", area: "Phuentsholing", postedAt: "2026-11-01T06:00:00Z", status: "available" },
  { id: "4", name: "Winter jackets", description: "Three adult jackets, sizes M and L. Washed and ready to wear.", category: "Clothing", condition: "Good", dzongkhag: "Bumthang", area: "Chamkhar", postedAt: "2026-10-31T06:00:00Z", status: "available" },
  { id: "5", name: "Study desk", description: "Wooden desk with one drawer. Solid, just has some pen marks on top.", category: "Furniture", condition: "Good", dzongkhag: "Punakha", area: "Khuruthang", postedAt: "2026-10-30T06:00:00Z", status: "reserved" },
  { id: "6", name: "Baby stroller", description: "Folds flat. Wheels roll smoothly. Our little one has grown out of it.", category: "Kids", condition: "Like new", dzongkhag: "Thimphu", area: "Babesa", postedAt: "2026-10-29T06:00:00Z", status: "available" },
  { id: "7", name: "Old laptop charger and mouse", description: "Charger fits many Dell laptops. Mouse is wireless, battery not included.", category: "Electronics", condition: "Fair", dzongkhag: "Samtse", area: "Samtse town", postedAt: "2026-10-27T06:00:00Z", status: "available" },
  { id: "8", name: "Cooking pots set", description: "Four steel pots with lids. Clean and still useful.", category: "Kitchen", condition: "Good", dzongkhag: "Mongar", area: "Mongar town", postedAt: "2026-10-25T06:00:00Z", status: "available" },
];
