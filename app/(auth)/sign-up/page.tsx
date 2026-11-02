import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Create an account | GiveAgain" };

export default async function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  const next = safeNext((await searchParams).next);
  const query = next === "/" ? "" : `?next=${encodeURIComponent(next)}`;

  return (
    <AuthCard
      title="Join GiveAgain"
      intro="One account to give and to ask. It's free."
      footer={{ text: "Already have an account?", label: "Sign in", href: `/sign-in${query}` }}
    >
      <SignUpForm next={next} />
    </AuthCard>
  );
}
