import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";

export function ItemGridFallback() {
  return (
    <div aria-busy className="grid sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <PhotoPlaceholder key={i} caption="Loading" className="aspect-square border-b border-line sm:border-r" />
      ))}
    </div>
  );
}
