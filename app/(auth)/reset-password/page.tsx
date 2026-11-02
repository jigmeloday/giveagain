import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Choose a new password | GiveAgain" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
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
