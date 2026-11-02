import { GiveSheetProvider } from "@/components/give/give-sheet-provider";
import { TopBar } from "@/components/home/top-bar";
import { SiteFooter } from "@/components/shares/site-footer";

/** Top bar, footer and the Give sheet around a page. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <GiveSheetProvider>
      <TopBar />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </GiveSheetProvider>
  );
}
