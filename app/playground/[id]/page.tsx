import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DemoViewer } from "@/components/playground/demo-viewer";
import { DEMOS, findDemo } from "@/components/playground/registry";

export function generateStaticParams() {
  return DEMOS.map((demo) => ({ id: demo.id }));
}

async function DemoPageContent({ params }: Pick<PageProps<"/playground/[id]">, "params">) {
  const { id } = await params;
  const demo = findDemo(id);
  if (!demo) notFound();

  return (
    <>
      <div className="flex flex-col gap-1">
        <Link href="/playground" className="text-sm text-primary-ink underline-offset-4 hover:underline">
          All components
        </Link>
        <h1 className="text-3xl">{demo.title}</h1>
        <p className="text-muted-foreground">{demo.description}</p>
      </div>
      <DemoViewer title={demo.title} src={`/playground/preview/${demo.id}`} />
    </>
  );
}

export default function DemoPage({ params }: PageProps<"/playground/[id]">) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-8">
      <Suspense fallback={null}>
        <DemoPageContent params={params} />
      </Suspense>
    </main>
  );
}
