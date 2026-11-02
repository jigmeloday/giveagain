"use client";

import { useState } from "react";
import { VIEWPORTS, type ViewportId } from "@/constants/playground";

export function useViewport() {
  const [viewportId, setViewportId] = useState<ViewportId>("phone");
  const viewport = VIEWPORTS.find((v) => v.id === viewportId) ?? VIEWPORTS[0];
  return { viewport, setViewportId };
}
