type DemoGroupProps = { title: string; children: React.ReactNode };

export function DemoGroup({ title, children }: DemoGroupProps) {
  return (
    <section className="flex flex-col gap-4 border-b border-line pb-8 last:border-b-0">
      <h2 className="font-mono text-[11px] font-bold tracking-[0.08em] text-primary-ink uppercase">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}
