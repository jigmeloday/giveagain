import { GiveButton } from "@/components/give/give-button";

export function SidebarHelp() {
  return (
    <div className="flex flex-col items-start gap-3 border-t-2 border-foreground pt-6">
      <p className="font-bold">Can&rsquo;t find it?</p>
      <p className="text-sm">New things are posted every day. Have something spare yourself?</p>
      <GiveButton variant="link" className="h-auto p-0">Give something away</GiveButton>
    </div>
  );
}
