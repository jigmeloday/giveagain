import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function ItemActions({ id, reserved }: { id: string; reserved: boolean }) {
  const signIn = `/sign-in?next=/items/${id}`;
  return (
    <div className="flex flex-col gap-3">
      {reserved ? (
        <p className="border border-line bg-mist p-4 text-sm">Someone is already collecting this. You can still ask in case it falls through.</p>
      ) : null}
      <Link href={signIn} className={buttonVariants({ size: "lg" })}>
        Ask for it &mdash; free
        <ArrowRight aria-hidden />
      </Link>
      <p className="text-sm text-muted-foreground">Sign in, leave your phone number, and the giver will contact you.</p>
      <Link href={signIn} className="inline-flex w-fit items-center gap-1 text-sm font-bold text-primary-ink hover:underline">
        <Flag aria-hidden className="size-4" />
        Report this item
      </Link>
    </div>
  );
}
