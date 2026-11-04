import { GiveButton } from "@/components/give/give-button";
import { WhenSignedIn } from "@/components/give/when-signed-in";

export function EmptyResults() {
  return (
    <div className="flex flex-col items-start gap-4 p-6 sm:p-10">
      <h2 className="text-2xl font-extrabold tracking-[-0.03em]">No giveaways here yet.</h2>
      <p className="max-w-md">Try a different word or area, or check back soon. New things are posted every day.</p>
      <WhenSignedIn>
        <GiveButton size="lg" />
      </WhenSignedIn>
    </div>
  );
}
