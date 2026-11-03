type Entry = { count: number; resetAt: number };

/**
 * A simple in-memory limit: at most `max` calls per `windowMs` for each key.
 * It resets if the server restarts and isn't shared between servers, so move it to the database or a cache before running several.
 */
export function createLimiter(max: number, windowMs: number) {
  const entries = new Map<string, Entry>();

  return function allow(key: string, now: number = Date.now()): boolean {
    for (const [k, e] of entries) if (e.resetAt <= now) entries.delete(k);
    const entry = entries.get(key);
    if (!entry) {
      entries.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= max) return false;
    entry.count += 1;
    return true;
  };
}
