import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b border-line px-4 py-3 sm:px-8">
        <Link href="/" className="flex w-fit items-center gap-2 font-extrabold tracking-tight">
          <span aria-hidden className="size-6 bg-primary" />
          GiveAgain
        </Link>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
