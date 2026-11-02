"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/account/sign-out-button";
import { cn } from "@/lib/utils";

type Tab = { label: string; href: string; badge?: number };

const ITEM = "flex h-11 shrink-0 items-center gap-2 px-4 font-medium whitespace-nowrap";

/** Side menu on wide screens, a scrolling row on phones. */
export function AccountNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Account">
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {tabs.map((tab) => {
          const current = pathname === tab.href || (tab.href !== "/account" && pathname.startsWith(`${tab.href}/`));
          return (
            <li key={tab.href}>
              <Link href={tab.href} aria-current={current ? "page" : undefined} className={cn(ITEM, current ? "bg-mist font-bold" : "hover:bg-mist")}>
                {tab.label}
                {tab.badge ? <span className="bg-primary px-1.5 font-mono text-[11px] text-primary-foreground">{tab.badge}</span> : null}
              </Link>
            </li>
          );
        })}
        <li className="md:mt-4 md:border-t-2 md:border-line md:pt-4">
          <SignOutButton className={cn(ITEM, "font-bold text-primary-ink hover:underline")} />
        </li>
      </ul>
    </nav>
  );
}
