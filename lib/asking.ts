/** "No one yet", "1 asking", "3 asking". */
export function askingLabel(count: number): string {
  return count === 0 ? "No one yet" : `${count} asking`;
}
