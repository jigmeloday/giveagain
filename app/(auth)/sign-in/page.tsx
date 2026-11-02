import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Sign in | GiveAgain" };

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const next = safeNext((await searchParams).next);
  const query = next === "/" ? "" : `?next=${encodeURIComponent(next)}`;

  return (
    <AuthCard
      title="Welcome back"
      intro="Sign in to give something away or ask for an item."
      footer={{ text: "New here?", label: "Create an account", href: `/sign-up${query}` }}
    >
      <SignInForm next={next} />
    </AuthCard>
  );
}
