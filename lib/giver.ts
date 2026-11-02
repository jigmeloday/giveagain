import { formatDate } from "@/lib/format";
import type { Listing } from "@/types/listing";

type Giver = Listing["giver"];

export function giverInitials(name: string): string {
  return name.replace(/[^\p{L} ]/gu, "").split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function giverFirstName(name: string): string {
  return name.split(" ")[0];
}

/** "Has given 12 things since Mar 2025." */
export function giverSummary({ given, since }: Giver): string {
  const month = formatDate(since).replace(/^\d+ /, "");
  return given === 0 ? "New here." : `Has given ${given} ${given === 1 ? "thing" : "things"} since ${month}`;
}
