import Link from "next/link";
import { DEMOS } from "@/components/playground/registry";

export default function PlaygroundPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl">Playground</h1>
        <p className="text-muted-foreground">Try components at phone, tablet and full width. Development only.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {DEMOS.map((demo) => (
          <li key={demo.id}>
            <Link
              href={`/playground/${demo.id}`}
              className="flex h-full flex-col gap-1 rounded-lg border p-4 hover:bg-mist focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="font-bold">{demo.title}</span>
              <span className="text-[13px] text-muted-foreground">{demo.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
