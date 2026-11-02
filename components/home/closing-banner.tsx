import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function ClosingBanner() {
  return (
    <section className="flex flex-col gap-10 bg-primary p-6 text-primary-foreground sm:p-10">
      <h2 className="max-w-3xl text-[clamp(36px,6vw,72px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
        Someone nearby needs what you don&rsquo;t.
      </h2>
      <Link href="/give" className={buttonVariants({ size: "lg", variant: "outline", className: "w-fit border-primary-foreground hover:text-foreground" })}>
        Give something away
        <Plus aria-hidden />
      </Link>
    </section>
  );
}
