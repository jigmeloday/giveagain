import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";

export function Hero() {
  return (
    <section className="grid border-b border-line md:grid-cols-2">
      <div className="flex flex-col justify-between gap-10 border-b border-line p-6 sm:p-10 md:border-r md:border-b-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">Free, for everyone in Bhutan</p>
        <div className="flex flex-col gap-6">
          <h1 className="text-[clamp(44px,8vw,88px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
            Give it away. Don&rsquo;t throw it away.
          </h1>
          <p className="max-w-md text-base">
            Have something you no longer need? Pass it to a neighbour who does. Everything here is free.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/give" className={buttonVariants({ size: "lg" })}>
              Give something away
              <Plus aria-hidden />
            </Link>
            <Link href="/browse" className={buttonVariants({ size: "lg", variant: "outline" })}>
              See what&rsquo;s free nearby
              <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </div>
      <PhotoPlaceholder caption="Photo: a neighbour handing over a chair" className="min-h-72 md:min-h-[480px]" />
    </section>
  );
}
