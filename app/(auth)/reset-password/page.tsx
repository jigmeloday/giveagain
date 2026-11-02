import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFallback } from "@/components/auth/auth-fallback";
import { ResetPasswordContent } from "@/components/auth/reset-password-content";

export const metadata: Metadata = { title: "Choose a new password | GiveAgain" };

export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<AuthFallback />}>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}
