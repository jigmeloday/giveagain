import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function EmptyResults() {
  return (
    <div className="flex flex-col items-start gap-4 p-6 sm:p-10">
      <h2 className="text-2xl font-extrabold tracking-[-0.03em]">No giveaways here yet.</h2>
      <p className="max-w-md">Try a different word or area, or be the first to give something away.</p>
      <Link href="/give" className={buttonVariants({ size: "lg" })}>
        Give something away
        <Plus aria-hidden />
      </Link>
    </div>
  );
}
