import Link from "next/link";
import { GiveButton } from "@/components/give/give-button";
import { FOOTER_LINKS } from "@/constants/home";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-line px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p className="text-muted-foreground">GiveAgain. Free things for neighbours in Bhutan.</p>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">{link.label}</Link>
        ))}
        <GiveButton variant="link" className="h-auto p-0 text-foreground">Give something</GiveButton>
      </nav>
    </footer>
  );
}
