import { GiveButton } from "@/components/give/give-button";
import { HeroSearch } from "@/components/home/hero-search";

export function Hero() {
  return (
    <section className="border-b border-line px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">Free things for neighbours in Bhutan</p>
          <h1 className="text-[clamp(40px,7vw,76px)]">Give what you don&rsquo;t need. Find what you do.</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Everything here is free. Pass things on to people nearby instead of throwing them away.
          </p>
        </div>
        <HeroSearch />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm text-muted-foreground">Have something to pass on?</span>
          <GiveButton variant="outline" />
        </div>
      </div>
    </section>
  );
}
