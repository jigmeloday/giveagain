import { STEPS } from "@/constants/home";

export function Steps() {
  return (
    <section aria-labelledby="steps-heading" className="border-b border-line">
      <h2 id="steps-heading" className="sr-only">How it works</h2>
      <ol className="grid md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3 border-b border-line p-6 last:border-b-0 sm:p-10 md:border-r md:border-b-0 md:last:border-r-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">Step 0{i + 1}</span>
            <h3 className="text-2xl font-extrabold tracking-[-0.03em]">{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
