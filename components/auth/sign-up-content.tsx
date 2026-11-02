import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { safeNext } from "@/lib/safe-next";

/** Reads the URL (`?next=`), so render it inside Suspense. */
export async function SignUpContent({ searchParams }: { searchParams: PageProps<"/sign-up">["searchParams"] }) {
  const next = safeNext((await searchParams).next);
  const query = next === "/" ? "" : `?next=${encodeURIComponent(next)}`;

  return (
    <AuthCard
      title="Create your account"
      intro="One account to give and to ask. It's free."
      footer={{ text: "Already have an account?", label: "Sign in", href: `/sign-in${query}` }}
    >
      <SignUpForm next={next} />
    </AuthCard>
  );
}
