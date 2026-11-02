import { cn } from "@/lib/utils";

type FilterSelectProps = {
  name: string;
  label: string;
  allLabel: string;
  options: readonly string[];
  defaultValue?: string;
  className?: string;
};

/** Native select for GET filter forms, so filtering works without JavaScript. */
export function FilterSelect({ name, label, allLabel, options, defaultValue, className }: FilterSelectProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-11 w-full border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
