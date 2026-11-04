import { Suspense } from "react";
import { hasSessionCookie } from "@/server/session-hint";

async function Gate({ children, signedIn }: { children: React.ReactNode; signedIn: boolean }) {
  return (await hasSessionCookie()) === signedIn ? <>{children}</> : null;
}

/**
 * Draws its content only when the browser carries a sign-in cookie. Decided on the server, so the right page
 * arrives already drawn and nothing pops in afterwards. This only controls what is shown; the server still
 * checks every action. `fallback` should reserve the same space if the content sits in the flow of the page.
 */
export function WhenSignedIn({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <Gate signedIn>{children}</Gate>
    </Suspense>
  );
}

/** The opposite: drawn only when there is no sign-in cookie (for "Sign in" links). Same rules as WhenSignedIn. */
export function WhenSignedOut({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Gate signedIn={false}>{children}</Gate>
    </Suspense>
  );
}
