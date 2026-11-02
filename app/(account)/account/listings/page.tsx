import type { Metadata } from "next";
import { MyListingCard } from "@/components/account/my-listing-card";
import { PageIntro } from "@/components/account/page-intro";
import { GiveButton } from "@/components/give/give-button";
import { EmptyState } from "@/components/shares/empty-state";
import { getMyListings } from "@/lib/account";

export const metadata: Metadata = { title: "Things I'm giving | GiveAgain" };

export default async function MyListingsPage() {
  const listings = await getMyListings();

  return (
    <>
      <PageIntro title="Things I'm giving" body="Everything you have posted. When someone asks for an item, you will see them here." />
      {listings.length === 0 ? (
        <EmptyState title="You haven't given anything yet." body="Got something you no longer need? A neighbour might.">
          <GiveButton size="lg" />
        </EmptyState>
      ) : (
        <ul className="grid items-start gap-4 p-4 sm:p-8 lg:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing} />
          ))}
        </ul>
      )}
    </>
  );
}
