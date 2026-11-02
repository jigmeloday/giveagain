import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot your password | GiveAgain" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      intro="Enter your email and we'll send you a link to choose a new one."
      footer={{ text: "Remembered it?", label: "Back to sign in", href: "/sign-in" }}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
