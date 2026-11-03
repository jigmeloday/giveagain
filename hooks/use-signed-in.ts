import { authClient } from "@/lib/auth-client";

/** True once the browser knows the visitor is signed in. False while loading and when signed out. */
export function useSignedIn(): boolean {
  const { data } = authClient.useSession();
  return Boolean(data?.user);
}
