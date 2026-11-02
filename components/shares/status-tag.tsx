import type { StatusTone } from "@/constants/status";
import { cn } from "@/lib/utils";

const TONES: Record<StatusTone, string> = {
  good: "border-primary-ink text-primary-ink",
  wait: "border-foreground text-foreground",
  quiet: "border-line text-muted-foreground",
  bad: "border-destructive text-destructive",
};

/** Small mono status label. The text always says the status, colour is only extra. */
export function StatusTag({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span className={cn("inline-flex h-6 items-center border px-2 font-mono text-[11px] uppercase tracking-[0.08em]", TONES[tone])}>
      {label}
    </span>
  );
}
