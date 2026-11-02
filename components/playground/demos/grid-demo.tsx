import { NEVER_WORDS } from "@/constants/playground";

export function GridDemo() {
  return (
    <div className="border border-line">
      <div className="grid sm:grid-cols-3">
        {["Post it", "A neighbour asks", "They collect it"].map((title, i) => (
          <div key={title} className="flex flex-col gap-3 border-b border-line p-5 sm:border-r sm:last:border-r-0">
            <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-primary-ink">0{i + 1}</span>
            <h3 className="text-xl">{title}</h3>
            <p className="text-[13px]">A photo, a title, roughly where it is.</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 border-b border-line sm:grid-cols-5">
        <h3 className="col-span-2 border-b border-line p-5 text-2xl sm:col-span-1 sm:border-b-0 sm:border-r">
          This is not a marketplace.
        </h3>
        {NEVER_WORDS.map((word) => (
          <div key={word} className="flex flex-col gap-3 border-line p-5 even:border-l sm:border-l-0 sm:border-r sm:last:border-r-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Never</span>
            <span className="text-xl font-extrabold line-through decoration-primary decoration-2">{word}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <div className="relative aspect-[4/3] max-w-xs bg-mist bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--line)_6px_7px)] opacity-90">
          <span className="absolute bottom-2 left-2 font-mono text-[11px] uppercase">Sofa</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">Furniture</span>
        <span className="text-[15px] font-bold">Three-seat sofa, grey linen</span>
      </div>
    </div>
  );
}
