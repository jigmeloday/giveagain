import { GIVE_STEPS } from "@/constants/give";
import { cn } from "@/lib/utils";

export function GiveStepBar({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 gap-3 sm:gap-6" aria-label="Steps">
      {GIVE_STEPS.map((item, i) => (
        <li key={item.key} aria-current={i === step ? "step" : undefined} className="flex flex-col gap-3">
          <span aria-hidden className={cn("h-1", i <= step ? "bg-primary" : "bg-line")} />
          <span className={cn("flex gap-2 text-sm sm:text-base", i === step ? "font-bold" : "text-muted-foreground")}>
            <span>0{i + 1}</span>
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sr-only sm:hidden">{item.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
