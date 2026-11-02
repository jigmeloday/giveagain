import type { Listing } from "@/types/listing";

export function ItemFacts({ condition, category, dzongkhag, area }: Pick<Listing, "condition" | "category" | "dzongkhag" | "area">) {
  const facts = [
    ["Condition", condition],
    ["Category", category],
    ["Area", `${area}, ${dzongkhag}`],
  ];
  return (
    <dl className="border-y border-line">
      {facts.map(([term, value]) => (
        <div key={term} className="flex justify-between gap-4 border-b border-line py-3 last:border-b-0">
          <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{term}</dt>
          <dd className="text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
