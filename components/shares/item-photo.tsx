import Image from "next/image";
import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";
import type { ItemPhoto as ItemPhotoType } from "@/types/listing";

type ItemPhotoProps = ItemPhotoType & {
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** A listing photo that fills its box, or the placeholder when there is no photo yet. */
export function ItemPhoto({ src, alt, sizes, priority, className }: ItemPhotoProps) {
  if (!src) return <PhotoPlaceholder caption={`Photo: ${alt}`} className={className} />;
  return (
    <div className={`relative bg-mist ${className ?? ""}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
