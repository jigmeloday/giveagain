import { Button } from "@/components/ui/button";

export function GiveDone({ onClose }: { onClose: () => void }) {
  return (
    <div role="status" className="mx-auto flex max-w-xl flex-col items-start gap-4 py-10">
      <h2 className="text-4xl">Thank you!</h2>
      <p>A volunteer will take a quick look. Once approved, your item appears for everyone, and people can ask for it.</p>
      <Button type="button" size="lg" onClick={onClose}>Done</Button>
    </div>
  );
}
