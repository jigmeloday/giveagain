import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";

export function ItemGridFallback() {
  return (
    <div aria-busy className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-8 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <PhotoPlaceholder key={i} caption="Loading" className="aspect-[4/5]" />
      ))}
    </div>
  );
}
