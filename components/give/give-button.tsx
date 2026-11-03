"use client";

import { Plus } from "lucide-react";
import { useGiveSheet } from "@/components/give/give-sheet-context";
import { Button } from "@/components/ui/button";
import { useSignedIn } from "@/hooks/use-signed-in";

type GiveButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick" | "type">;

/** Opens the "Give something away" sheet. Only signed-in visitors see it. Must be used inside GiveSheetProvider. */
export function GiveButton({ children = "Give something away", ...props }: GiveButtonProps) {
  const { open } = useGiveSheet();
  const signedIn = useSignedIn();
  if (!signedIn) return null;
  return (
    <Button type="button" onClick={open} {...props}>
      {children}
      {props.variant !== "link" && <Plus aria-hidden />}
    </Button>
  );
}
