import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

/** Reads the URL (`?token=`), so render it inside Suspense. */
export async function ResetPasswordContent({ searchParams }: { searchParams: PageProps<"/reset-password">["searchParams"] }) {
  const raw = (await searchParams).token;
  const token = Array.isArray(raw) ? raw[0] : raw;

  if (!token) {
    return (
      <AuthCard
        title="This link isn't working"
        intro="The reset link is missing or has expired. Ask for a new one."
        footer={{ text: "Need a new link?", label: "Reset your password", href: "/forgot-password" }}
      >
        {null}
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
