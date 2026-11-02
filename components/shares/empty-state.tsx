type EmptyStateProps = {
  title: string;
  body: string;
  children?: React.ReactNode;
};

export function EmptyState({ title, body, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-4 p-6 sm:p-10">
      <h2 className="text-2xl tracking-[-0.03em]">{title}</h2>
      <p className="max-w-md text-muted-foreground">{body}</p>
      {children}
    </div>
  );
}
