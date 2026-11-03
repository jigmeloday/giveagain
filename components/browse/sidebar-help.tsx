import { GiveButton } from "@/components/give/give-button";
import { WhenSignedIn } from "@/components/give/when-signed-in";

export function SidebarHelp() {
  return (
    <div className="flex flex-col items-start gap-3 border-t-2 border-foreground pt-6">
      <p className="font-bold">Can&rsquo;t find it?</p>
      <p className="text-sm">New things are posted every day, so check back soon.</p>
      <WhenSignedIn>
        <p className="text-sm">Have something spare yourself?</p>
        <GiveButton variant="link" className="h-auto p-0">Give something away</GiveButton>
      </WhenSignedIn>
    </div>
  );
}
