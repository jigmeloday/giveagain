import { SideNav } from "@/components/shares/side-nav";

type SideMenuLayoutProps = {
  title: string;
  tabs: React.ComponentProps<typeof SideNav>["tabs"];
  children: React.ReactNode;
};

/** A sticky side menu on wide screens (a scrolling row on phones) with the page beside it. */
export function SideMenuLayout({ title, tabs, children }: SideMenuLayoutProps) {
  return (
    <div className="grid md:grid-cols-[17rem_1fr]">
      <div className="border-b-2 border-line md:border-r-2 md:border-b-0">
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:sticky md:top-0">
          <h1 className="text-3xl tracking-[-0.03em]">{title}</h1>
          <SideNav label={title} tabs={tabs} />
        </div>
      </div>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
