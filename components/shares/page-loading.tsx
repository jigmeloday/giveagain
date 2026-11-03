/** Shown inside the page area while a page loads, so the menu and header stay in place. */
export function PageLoading() {
  return (
    <div role="status" aria-busy className="flex flex-col gap-4 p-6 sm:p-10">
      <span className="sr-only">Loading…</span>
      <div aria-hidden className="h-10 w-1/2 bg-mist" />
      <div aria-hidden className="h-4 w-3/4 bg-mist" />
      <div aria-hidden className="h-4 w-2/3 bg-mist" />
    </div>
  );
}
