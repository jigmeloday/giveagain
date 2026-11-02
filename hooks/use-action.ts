import { useState } from "react";

const FALLBACK_ERROR = "Something went wrong. Please try again.";

/** Runs one async action (accept, withdraw, ...) and tracks pending, done and a friendly error. */
export function useAction<Args extends unknown[]>(action: (...args: Args) => Promise<void>) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();

  async function run(...args: Args) {
    setPending(true);
    setError(undefined);
    try {
      await action(...args);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : FALLBACK_ERROR);
    } finally {
      setPending(false);
    }
  }

  return { run, pending, done, error };
}
