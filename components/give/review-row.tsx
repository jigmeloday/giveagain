import { Button } from "@/components/ui/button";

type ReviewRowProps = { term: string; value: string; onChange: () => void };

export function ReviewRow({ term, value, onChange }: ReviewRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <dt className="text-sm text-muted-foreground">{term}</dt>
        <dd className="font-bold break-words">{value || "Not added"}</dd>
      </div>
      <Button type="button" variant="link" onClick={onChange} aria-label={`Change ${term}`}>Change</Button>
    </div>
  );
}
