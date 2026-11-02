import Link from "next/link";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AuthSwitch } from "@/components/auth/auth-switch";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="flex items-center justify-between border-b-2 border-line px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span aria-hidden className="size-5 bg-primary" />
          GiveAgain
        </Link>
        <Suspense fallback={null}>
          <AuthSwitch />
        </Suspense>
      </header>
      <div className="grid flex-1 md:grid-cols-2">
        <AuthPanel />
        <main className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-14 lg:px-20">{children}</main>
      </div>
    </>
  );
}
