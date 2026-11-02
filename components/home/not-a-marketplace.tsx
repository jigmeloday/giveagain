import { NOT_FOR_SALE } from "@/constants/home";

export function NotAMarketplace() {
  return (
    <section className="flex flex-col gap-4 border-b border-line bg-mist p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
      <h2 className="text-2xl font-extrabold tracking-[-0.03em]">This is not a marketplace.</h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm uppercase tracking-[0.08em] text-muted-foreground">
        {NOT_FOR_SALE.map((word) => (
          <li key={word} className="line-through">{word}</li>
        ))}
      </ul>
    </section>
  );
}
