/** Escapes % _ and \ so a search word is matched literally by ILIKE ... ESCAPE '\'. */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}
