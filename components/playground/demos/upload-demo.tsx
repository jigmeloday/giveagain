"use client";

import { useState } from "react";
import { DemoGroup } from "@/components/playground/demo-group";
import { ImageUpload } from "@/components/shares/image-upload";

export function UploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [few, setFew] = useState<File[]>([]);

  return (
    <DemoGroup title="Image upload">
      <ImageUpload
        label="Photos"
        hint="Show the whole item first, in daylight. JPEG, PNG or WebP."
        files={files}
        onChange={setFiles}
        required
      />
      <ImageUpload label="Photos (up to 2)" files={few} onChange={setFew} max={2} />
      <ImageUpload label="Photos" error="Add at least one photo." files={[]} onChange={() => undefined} />
    </DemoGroup>
  );
}
