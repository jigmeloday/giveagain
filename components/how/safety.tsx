import { SAFETY_POINTS } from "@/constants/how-it-works";

export function Safety() {
  return (
    <section aria-labelledby="safety-heading" className="border-b border-line bg-mist p-6 sm:p-10">
      <h2 id="safety-heading" className="mb-4 text-2xl font-extrabold tracking-[-0.03em]">Staying safe and private</h2>
      <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
        {SAFETY_POINTS.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
