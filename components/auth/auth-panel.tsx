import { Check } from "lucide-react";
import { AUTH_PERKS } from "@/constants/auth";

/** The orange side of the sign-in and sign-up pages. Hidden on phones to keep the form short. */
export function AuthPanel() {
  return (
    <aside className="hidden flex-col justify-between gap-16 bg-primary p-10 text-primary-foreground md:flex lg:p-14">
      <div className="flex flex-col gap-6">
        <p className="text-[clamp(44px,5.5vw,84px)] font-extrabold leading-[0.95] tracking-[-0.04em]">Give what you don&rsquo;t need. Find what you do.</p>
        <p className="max-w-md text-lg">Join your neighbours in passing things on instead of throwing them away. It&rsquo;s free, and it takes a minute.</p>
      </div>
      <ul className="flex flex-col gap-4 border-t-2 border-primary-foreground pt-8">
        {AUTH_PERKS.map((perk) => (
          <li key={perk} className="flex items-center gap-3">
            <Check aria-hidden className="size-5 shrink-0" />
            {perk}
          </li>
        ))}
      </ul>
    </aside>
  );
}
