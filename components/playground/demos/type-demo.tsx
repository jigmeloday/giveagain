import { TYPE_SCALE } from "@/constants/playground";

export function TypeDemo() {
  return (
    <ul className="flex flex-col gap-5">
      {TYPE_SCALE.map((row) => (
        <li key={row.label} className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {row.label}
          </span>
          <span className={row.className}>Your old sofa is someone&apos;s new one.</span>
        </li>
      ))}
    </ul>
  );
}
