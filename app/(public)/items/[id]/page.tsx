import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { ItemActions } from "@/components/item/item-actions";
import { ItemFacts } from "@/components/item/item-facts";
import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";
import { PostedAgo } from "@/components/item/posted-ago";
import { getListing } from "@/lib/listings";

export async function generateMetadata({ params }: PageProps<"/items/[id]">): Promise<Metadata> {
  const item = getListing((await params).id);
  return { title: item ? `${item.name} | GiveAgain` : "Item not found | GiveAgain" };
}

export default async function ItemPage({ params }: PageProps<"/items/[id]">) {
  const item = getListing((await params).id);
  if (!item) notFound();

  return (
    <main>
      <div className="border-b border-line px-4 py-3 sm:px-8">
        <Link href="/browse" className="inline-flex items-center gap-1 text-sm font-bold text-primary-ink hover:underline">
          <ArrowLeft aria-hidden className="size-4" />
          All free things
        </Link>
      </div>
      <div className="grid md:grid-cols-2">
        <PhotoPlaceholder caption={`Photo: ${item.name}`} className="aspect-square border-b border-line md:border-r md:border-b-0" />
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">Free &middot; Posted <Suspense fallback="recently"><PostedAgo postedAt={item.postedAt} /></Suspense></p>
          <h1 className="text-[clamp(32px,5vw,56px)] font-extrabold leading-[0.95] tracking-[-0.04em]">{item.name}</h1>
          <p className="max-w-prose">{item.description}</p>
          <ItemFacts {...item} />
          <ItemActions id={item.id} reserved={item.status === "reserved"} />
        </div>
      </div>
    </main>
  );
}
