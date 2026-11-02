export function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col">
      <legend className="mb-1 text-sm text-muted-foreground">{legend}</legend>
      {children}
    </fieldset>
  );
}
