"use client";

import { Button } from "@/components/ui/button";
import { VIEWPORTS } from "@/constants/playground";
import { useViewport } from "./use-viewport";

type DemoViewerProps = { title: string; src: string };

export function DemoViewer({ title, src }: DemoViewerProps) {
  const { viewport, setViewportId } = useViewport();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Preview width">
        {VIEWPORTS.map((v) => (
          <Button
            key={v.id}
            variant={v.id === viewport.id ? "default" : "outline"}
            aria-pressed={v.id === viewport.id}
            onClick={() => setViewportId(v.id)}
          >
            {v.label}
            {v.width ? ` · ${v.width}` : ""}
          </Button>
        ))}
        <a href={src} target="_blank" rel="noreferrer" className="ml-auto text-sm text-primary underline-offset-4 hover:underline">
          Open on its own
        </a>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-mist p-4">
        <iframe
          title={`${title} preview`}
          src={src}
          style={{ width: viewport.width ?? "100%" }}
          className="mx-auto block h-[70vh] max-w-full rounded-lg border bg-background"
        />
      </div>
    </div>
  );
}
