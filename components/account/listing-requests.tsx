import { RequestRow } from "@/components/account/request-row";
import type { BookingRequest } from "@/types/account";

export function ListingRequests({ name, requests }: { name: string; requests: BookingRequest[] }) {
  return (
    <section aria-label={`People who asked for ${name}`} className="flex flex-col gap-2">
      <h2 className="border-b-2 border-line pb-3 text-2xl tracking-[-0.03em]">
        {requests.length === 0 ? "No one has asked yet" : requests.length === 1 ? "1 person asked" : `${requests.length} people asked`}
      </h2>
      {requests.length > 0 && (
        <ul className="divide-y divide-line">
          {requests.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </ul>
      )}
    </section>
  );
}
