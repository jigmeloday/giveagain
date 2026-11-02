const cache = new WeakMap<File, string>();

/** A preview URL for a picked file, made once per file. The browser frees them when the page closes. */
export function fileUrl(file?: File): string | undefined {
  if (!file) return undefined;
  let url = cache.get(file);
  if (!url) {
    url = URL.createObjectURL(file);
    cache.set(file, url);
  }
  return url;
}
