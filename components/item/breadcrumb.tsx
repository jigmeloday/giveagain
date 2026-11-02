import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line px-4 py-3 text-sm sm:px-8">
      <ol className="flex flex-wrap items-center gap-x-2">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {crumb.href ? <Link href={crumb.href} className="text-muted-foreground hover:underline">{crumb.label}</Link> : <span aria-current="page" className="font-medium">{crumb.label}</span>}
            {i < crumbs.length - 1 && <span aria-hidden className="text-muted-foreground">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
