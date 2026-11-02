export function PageIntro({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-line p-6 sm:px-10">
      <h2 className="text-3xl tracking-[-0.03em]">{title}</h2>
      <p className="max-w-xl text-lg text-muted-foreground">{body}</p>
    </div>
  );
}
