export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="border border-destructive p-3 text-sm text-destructive">
      {message}
    </p>
  );
}
