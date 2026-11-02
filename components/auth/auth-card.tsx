import Link from "next/link";

type AuthCardProps = {
  title: string;
  intro?: string;
  children: React.ReactNode;
  footer?: { text: string; label: string; href: string };
};

export function AuthCard({ title, intro, children, footer }: AuthCardProps) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10 sm:py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(36px,8vw,56px)] font-extrabold leading-[0.95] tracking-[-0.04em]">{title}</h1>
        {intro && <p className="text-muted-foreground">{intro}</p>}
      </div>
      {children}
      {footer && (
        <p className="border-t border-line pt-6 text-sm">
          {footer.text}{" "}
          <Link href={footer.href} className="font-bold text-primary-ink hover:underline">{footer.label}</Link>
        </p>
      )}
    </main>
  );
}
