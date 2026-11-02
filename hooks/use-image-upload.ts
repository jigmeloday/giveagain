import { useEffect, useRef, useState } from "react";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/images";

type Options = {
  files: File[];
  max: number;
  onChange: (files: File[]) => void;
};

export function useImageUpload({ files, max, onChange }: Options) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Map<File, string>>(new Map());
  const latest = useRef(previews);
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    latest.current = previews;
  }, [previews]);

  useEffect(() => () => latest.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    const images = picked.filter((file) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type));
    const added = images.slice(0, Math.max(max - files.length, 0));
    setNotice(added.length < picked.length ? `Some files were skipped. Use JPEG, PNG or WebP, up to ${max} photos.` : undefined);
    setPreviews((current) => new Map([...current, ...added.map((file): [File, string] => [file, URL.createObjectURL(file)])]));
    onChange([...files, ...added]);
    event.target.value = "";
  };

  const remove = (index: number) => {
    const url = previews.get(files[index]);
    if (url) URL.revokeObjectURL(url);
    setPreviews((current) => {
      const next = new Map(current);
      next.delete(files[index]);
      return next;
    });
    onChange(files.filter((_, i) => i !== index));
  };

  return {
    inputRef,
    notice,
    onPick,
    remove,
    open: () => inputRef.current?.click(),
    full: files.length >= max,
    items: files.map((file, index) => ({ key: `${file.name}-${file.lastModified}-${index}`, url: previews.get(file) })),
  };
}
