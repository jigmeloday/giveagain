import { cn } from "@/lib/utils";

type PhotoPlaceholderProps = {
  caption?: string;
  className?: string;
};

/** Mist block with thin diagonal lines, shown where a photo has not loaded. */
export function PhotoPlaceholder({ caption = "Photo", className }: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={caption}
      className={cn(
        "flex items-end bg-mist p-3 bg-[repeating-linear-gradient(135deg,transparent_0_10px,var(--line)_10px_11px)]",
        className,
      )}
    >
      <span className="bg-mist px-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{caption}</span>
    </div>
  );
}
