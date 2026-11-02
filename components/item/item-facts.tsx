import type { Listing } from "@/types/listing";

type ItemFactsProps = Pick<Listing, "condition" | "size" | "collection" | "headsUp">;

/** Up to four facts in a two-column grid, skipping any the giver didn't give. */
export function ItemFacts({ condition, size, collection, headsUp }: ItemFactsProps) {
  const facts = [
    ["Condition", condition],
    ["Size", size],
    ["Collection", collection],
    ["Heads up", headsUp],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  return (
    <dl className="grid grid-cols-2 border-y-2 border-line">
      {facts.map(([term, value], i) => (
        <div key={term} className={`flex flex-col gap-1 py-4 ${i % 2 === 0 ? "pr-4" : "pl-4"} ${i >= 2 ? "border-t border-line" : ""}`}>
          <dt className="text-sm text-muted-foreground">{term}</dt>
          <dd className="font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
