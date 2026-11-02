import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QUICK_CATEGORIES } from "@/constants/home";

export function HeroSearch() {
  return (
    <div className="flex flex-col gap-3">
      <form role="search" action="/browse" className="flex">
        <Input name="q" type="search" aria-label="Search free things" placeholder="Search, e.g. sofa or books" className="h-12 border-foreground" />
        <Button type="submit" size="lg" className="shrink-0">
          <Search aria-hidden />
          Search
        </Button>
      </form>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" aria-label="Popular categories">
        <li className="text-muted-foreground">Or browse:</li>
        {QUICK_CATEGORIES.map((category) => (
          <li key={category}>
            <Link href={`/browse?category=${category}`} className="font-bold text-primary-ink hover:underline">{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
