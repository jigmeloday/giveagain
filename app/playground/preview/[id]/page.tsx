import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DEMOS, findDemo } from "@/components/playground/registry";

export function generateStaticParams() {
  return DEMOS.map((demo) => ({ id: demo.id }));
}

async function Preview({ params }: Pick<PageProps<"/playground/preview/[id]">, "params">) {
  const { id } = await params;
  const demo = findDemo(id);
  if (!demo) notFound();
  return <demo.Component />;
}

export default function PreviewPage({ params }: PageProps<"/playground/preview/[id]">) {
  return (
    <main className="p-4">
      <Suspense fallback={null}>
        <Preview params={params} />
      </Suspense>
    </main>
  );
}
