"use client";

import { useState } from "react";
import { GiveSheetContext } from "@/components/give/give-sheet-context";
import { GiveWizard } from "@/components/give/give-wizard";
import { Sheet, SheetContent } from "@/components/ui/sheet";

/** Holds the full-page bottom sheet for giving something away. Wrap the pages that have a Give button. */
export function GiveSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <GiveSheetContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-dvh max-h-dvh gap-0 overflow-hidden bg-background">
          <GiveWizard onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </GiveSheetContext.Provider>
  );
}
