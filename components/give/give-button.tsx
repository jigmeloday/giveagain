"use client";

import { Plus } from "lucide-react";
import { useGiveSheet } from "@/components/give/give-sheet-context";
import { Button } from "@/components/ui/button";

type GiveButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick" | "type">;

/** Opens the "Give something away" sheet. Must be used inside GiveSheetProvider. */
export function GiveButton({ children = "Give something away", ...props }: GiveButtonProps) {
  const { open } = useGiveSheet();
  return (
    <Button type="button" onClick={open} {...props}>
      {children}
      {props.variant !== "link" && <Plus aria-hidden />}
    </Button>
  );
}
