"use client";

import { useSignedIn } from "@/hooks/use-signed-in";

/** Shows its content only to signed-in visitors. Signed-out visitors see nothing. */
export function WhenSignedIn({ children }: { children: React.ReactNode }) {
  return useSignedIn() ? <>{children}</> : null;
}
