"use client";

import { useState } from "react";
import { GiveForm } from "@/components/give/give-form";
import { GiveSheetContext } from "@/components/give/give-sheet-context";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/** Holds the full-page bottom sheet for giving something away. Wrap the pages that have a Give button. */
export function GiveSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <GiveSheetContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-dvh max-h-dvh gap-0 bg-background">
          <SheetHeader className="border-b border-line px-6 py-4 pr-16 sm:px-10">
            <SheetTitle className="text-2xl font-extrabold tracking-[-0.04em]">Give something away</SheetTitle>
            <SheetDescription>Free to take. A volunteer checks every post before it goes live.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
            <GiveForm onClose={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </GiveSheetContext.Provider>
  );
}
