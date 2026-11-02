import { useEffect, useRef, useState } from "react";

/** A preview URL for one picked file. Call `pick` with the new file (or null); old URLs are released. */
export function usePreviewUrl(onChange: (file: File | null) => void) {
  const [url, setUrl] = useState<string>();
  const current = useRef<string>(undefined);

  useEffect(() => () => {
    if (current.current) URL.revokeObjectURL(current.current);
  }, []);

  function pick(file: File | null) {
    if (current.current) URL.revokeObjectURL(current.current);
    current.current = file ? URL.createObjectURL(file) : undefined;
    setUrl(current.current);
    onChange(file);
  }

  return { url, pick };
}
