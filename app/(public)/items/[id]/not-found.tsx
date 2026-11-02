import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ItemNotFound() {
  return (
    <main className="flex flex-col items-start gap-4 p-6 sm:p-10">
      <h1 className="text-3xl font-extrabold tracking-[-0.04em]">We can&rsquo;t find that item.</h1>
      <p>It may have been given away or taken down.</p>
      <Link href="/browse" className={buttonVariants({ size: "lg" })}>See what&rsquo;s free</Link>
    </main>
  );
}
