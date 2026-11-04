import { WhenSignedIn } from "@/components/give/when-signed-in";
import { GiveSheetProvider } from "@/components/give/give-sheet-provider";
import { TopBar } from "@/components/home/top-bar";
import { SessionKeeper } from "@/components/shares/session-keeper";
import { SiteFooter } from "@/components/shares/site-footer";

/** Top bar, footer and the Give sheet around a page. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <GiveSheetProvider>
      <WhenSignedIn>
        <SessionKeeper />
      </WhenSignedIn>
      <TopBar />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </GiveSheetProvider>
  );
}
