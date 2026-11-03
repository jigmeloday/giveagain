import Link from "next/link";
import { ArrowRight } from "lucide-react";

type StatTileProps = {
  label: string;
  value: number;
  note?: string;
  href?: string;
  /** Draws the tile in orange to say "this needs you". */
  attention?: boolean;
};

export function StatTile({ label, value, note, href, attention }: StatTileProps) {
  const body = (
    <>
      <p className="text-sm">{label}</p>
      <p className="text-[clamp(48px,6vw,80px)] font-extrabold leading-none tracking-[-0.05em]">{value}</p>
      <p className="flex min-h-5 items-center gap-1 text-sm">
        {note}
        {href && <ArrowRight aria-hidden className="size-4" />}
      </p>
    </>
  );
  const style = `flex flex-col gap-3 border border-line p-5 ${attention && value > 0 ? "bg-primary text-primary-foreground" : "bg-card"}`;

  return href ? <Link href={href} className={`${style} hover:underline`}>{body}</Link> : <div className={style}>{body}</div>;
}
