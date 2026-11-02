import { NOT_FOR_SALE } from "@/constants/home";

export function NotAMarketplace() {
  return (
    <section aria-label="Always free" className="flex flex-col gap-2 border-b border-line bg-mist px-6 py-6 sm:flex-row sm:items-center sm:gap-6 sm:px-10">
      <p className="font-bold">This is not a marketplace.</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
        {NOT_FOR_SALE.map((word) => (
          <li key={word} className="line-through">{word}</li>
        ))}
      </ul>
    </section>
  );
}
