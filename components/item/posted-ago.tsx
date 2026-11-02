import { connection } from "next/server";
import { timeAgo } from "@/lib/format";

/** Reads the clock, so it renders at request time. Wrap in Suspense. */
export async function PostedAgo({ postedAt }: { postedAt: string }) {
  await connection();
  return <>{timeAgo(postedAt)}</>;
}
