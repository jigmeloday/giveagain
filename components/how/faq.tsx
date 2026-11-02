import { FAQ } from "@/constants/how-it-works";

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="border-b border-line">
      <h2 id="faq-heading" className="border-b border-line p-6 text-2xl font-extrabold tracking-[-0.03em] sm:px-10">Questions</h2>
      {FAQ.map((item) => (
        <details key={item.question} className="group border-b border-line px-6 py-4 last:border-b-0 sm:px-10">
          <summary className="cursor-pointer font-bold marker:text-primary-ink">{item.question}</summary>
          <p className="mt-2 max-w-prose">{item.answer}</p>
        </details>
      ))}
    </section>
  );
}
