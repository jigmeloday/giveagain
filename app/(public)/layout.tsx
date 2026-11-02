import { SiteFooter } from "@/components/shares/site-footer";
import { TopBar } from "@/components/home/top-bar";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <TopBar />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
