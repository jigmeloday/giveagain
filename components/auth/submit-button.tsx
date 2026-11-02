import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Please wait…" : label}
      {!pending && <ArrowRight aria-hidden />}
    </Button>
  );
}
