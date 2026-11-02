import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { safeNext } from "@/lib/safe-next";

/** Reads the URL (`?next=`), so render it inside Suspense. */
export async function SignInContent({ searchParams }: { searchParams: PageProps<"/sign-in">["searchParams"] }) {
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
