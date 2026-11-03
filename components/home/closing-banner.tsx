import { GiveButton } from "@/components/give/give-button";
import { WhenSignedIn } from "@/components/give/when-signed-in";

export function ClosingBanner() {
  return (
    <WhenSignedIn>
      <section className="bg-primary px-6 py-14 text-primary-foreground sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6">
          <h2 className="text-[clamp(32px,5vw,56px)]">Someone nearby could use what you have.</h2>
          <GiveButton size="lg" variant="outline" className="border-primary-foreground hover:text-foreground" />
        </div>
      </section>
    </WhenSignedIn>
  );
}
