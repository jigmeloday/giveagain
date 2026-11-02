import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = { label: string; pending: boolean; className?: string };

export function SubmitButton({ label, pending, className }: SubmitButtonProps) {
  return (
    <Button type="submit" size="lg" disabled={pending} className={cn("h-14 w-full justify-between px-5 text-base", className)}>
      {pending ? "Please wait…" : label}
      {!pending && <ArrowRight aria-hidden />}
    </Button>
  );
}
