export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <h2 className="border-b-2 border-line pb-4 text-3xl tracking-[-0.03em]">{title}</h2>
      {children}
    </section>
  );
}
