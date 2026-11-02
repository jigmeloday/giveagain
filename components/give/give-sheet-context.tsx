"use client";

import { createContext, useContext } from "react";

export const GiveSheetContext = createContext<{ open: () => void } | null>(null);

export function useGiveSheet() {
  const context = useContext(GiveSheetContext);
  if (!context) throw new Error("useGiveSheet must be used inside GiveSheetProvider");
  return context;
}
