import Link from "next/link";
import { Suspense } from "react";
import { AccountLink } from "@/components/home/account-link";
import { GiveButton } from "@/components/give/give-button";
import { WhenSignedIn } from "@/components/give/when-signed-in";
import { NAV_LINKS } from "@/constants/home";

export function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-8">
      <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
        <span aria-hidden className="size-6 bg-primary" />
        GiveAgain
      </Link>
      <nav aria-label="Main" className="flex items-center gap-5">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hidden text-sm font-medium hover:underline sm:inline">
            {link.label}
          </Link>
        ))}
        <Suspense fallback={null}>
          <AccountLink />
        </Suspense>
        <WhenSignedIn>
          <GiveButton>Give something</GiveButton>
        </WhenSignedIn>
      </nav>
    </header>
  );
}
