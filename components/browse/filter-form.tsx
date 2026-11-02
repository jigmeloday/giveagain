"use client";

/** Wraps the filters in a GET form that re-searches whenever a choice changes. Search itself joins via form="browse-filters". */
export function FilterForm({ children }: { children: React.ReactNode }) {
  return (
    <form id="browse-filters" action="/browse" onChange={(e) => e.currentTarget.requestSubmit()} className="flex flex-col gap-8">
      {children}
    </form>
  );
}
