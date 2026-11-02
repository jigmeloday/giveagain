import { COLOR_TOKENS } from "@/constants/playground";

export function ColorsDemo() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {COLOR_TOKENS.map((token) => (
        <li key={token.name} className="flex flex-col gap-2">
          <div className={`h-14 rounded-lg ${token.className}`} />
          <p className="text-[13px] font-bold">{token.name}</p>
          <p className="text-[13px] text-muted-foreground">{token.note}</p>
        </li>
      ))}
    </ul>
  );
}
