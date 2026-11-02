import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GiveButton } from "@/components/give/give-button";
import { Faq } from "@/components/how/faq";
import { Safety } from "@/components/how/safety";
import { StepList } from "@/components/how/step-list";
import { buttonVariants } from "@/components/ui/button";
import { GIVER_STEPS, SEEKER_STEPS } from "@/constants/how-it-works";

export const metadata: Metadata = {
  title: "How it works | GiveAgain",
  description: "Give things away or ask for them, free, in a few simple steps.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <section className="flex flex-col gap-6 border-b border-line p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">How it works</p>
        <h1 className="max-w-3xl text-[clamp(40px,7vw,80px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          Free things, passed neighbour to neighbour.
        </h1>
        <p className="max-w-xl">One person gives, another asks, they meet. No money, ever.</p>
      </section>
      <div className="grid lg:grid-cols-2">
        <StepList heading="If you're giving" steps={GIVER_STEPS} className="lg:border-r lg:border-line" />
        <StepList heading="If you're asking" steps={SEEKER_STEPS} />
      </div>
      <Safety />
      <Faq />
      <section className="flex flex-col gap-3 p-6 sm:flex-row sm:p-10">
        <GiveButton size="lg" />
        <Link href="/browse" className={buttonVariants({ size: "lg", variant: "outline" })}>
          See what&rsquo;s free nearby
          <ArrowRight aria-hidden />
        </Link>
      </section>
    </main>
  );
}
