import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { giverFirstName } from "@/lib/giver";

type ItemActionsProps = { id: string; giverName: string; reserved: boolean };

export function ItemActions({ id, giverName, reserved }: ItemActionsProps) {
  const signIn = `/sign-in?next=/items/${id}`;
  const first = giverFirstName(giverName);

  return (
    <div className="flex flex-col gap-3">
      {reserved && <p className="bg-mist p-4 text-sm">Someone is already collecting this. You can still ask in case it falls through.</p>}
      <Link href={signIn} className={buttonVariants({ size: "lg", className: "h-14 justify-between px-5 text-base" })}>
        Ask {first} for this &mdash; free
        <ArrowRight aria-hidden />
      </Link>
      <p className="text-sm text-muted-foreground">
        {first} chooses who it goes to, so there&rsquo;s no queue to win. A line about why it would help goes a long way.
      </p>
      <Link href={signIn} className="inline-flex w-fit items-center gap-1 text-sm font-bold text-primary-ink hover:underline">
        <Flag aria-hidden className="size-4" />
        Report this item
      </Link>
    </div>
  );
}
