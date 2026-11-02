type Step = { title: string; body: string };

type StepListProps = {
  heading: string;
  steps: readonly Step[];
  className?: string;
};

export function StepList({ heading, steps, className }: StepListProps) {
  return (
    <section aria-label={heading} className={className}>
      <h2 className="border-b border-line p-6 text-2xl font-extrabold tracking-[-0.03em] sm:px-10">{heading}</h2>
      <ol>
        {steps.map((step, i) => (
          <li key={step.title} className="grid gap-2 border-b border-line p-6 sm:grid-cols-[96px_1fr] sm:px-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">Step 0{i + 1}</span>
            <div className="flex flex-col gap-1">
              <h3 className="text-[15px] font-bold">{step.title}</h3>
              <p className="max-w-prose">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
