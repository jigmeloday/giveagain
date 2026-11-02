import Link from "next/link";
import { STEPS } from "@/constants/home";

export function Steps() {
  return (
    <section aria-labelledby="steps-heading" className="border-b border-line px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <h2 id="steps-heading" className="text-3xl sm:text-4xl">How it works</h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">Step {i + 1}</span>
              <h3 className="text-xl tracking-[-0.02em]">{step.title}</h3>
              <p className="text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <Link href="/how-it-works" className="w-fit text-sm font-bold text-primary-ink hover:underline">Read the full guide</Link>
      </div>
    </section>
  );
}
