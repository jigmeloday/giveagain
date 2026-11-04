/** Wraps a skeleton so screen readers hear "Loading" once, instead of every grey block. */
export function Region({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-busy className={className}>
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}
