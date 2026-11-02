/** Only allow same-site paths after sign-in, so a link can't send people elsewhere. */
export function safeNext(value: string | string[] | undefined): string {
  const next = Array.isArray(value) ? value[0] : value;
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/";
}
