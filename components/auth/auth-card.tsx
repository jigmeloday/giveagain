import Link from "next/link";

type AuthCardProps = {
  title: string;
  intro?: string;
  children: React.ReactNode;
  footer?: { text: string; label: string; href: string };
};

export function AuthCard({ title, intro, children, footer }: AuthCardProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-[clamp(36px,5vw,56px)]">{title}</h1>
        {intro && <p className="text-lg text-muted-foreground">{intro}</p>}
      </div>
      {children}
      {footer && (
        <p className="border-t border-line pt-6">
          {footer.text}{" "}
          <Link href={footer.href} className="font-bold text-primary-ink hover:underline">{footer.label}</Link>
        </p>
      )}
    </div>
  );
}
