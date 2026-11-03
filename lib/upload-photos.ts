export type UploadedPhoto = { key: string; width: number; height: number };

/** Sends photos to the server one at a time (kinder to slow connections) and returns where each was stored. */
export async function uploadPhotos(files: File[]): Promise<UploadedPhoto[]> {
  const stored: UploadedPhoto[] = [];
  for (const file of files) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/photos", { method: "POST", body }).catch(() => null);
    if (!response) throw new Error("We couldn't reach the server. Check your connection and try again.");
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "We couldn't save that photo. Please try again.");
    stored.push(data as UploadedPhoto);
  }
  return stored;
}
