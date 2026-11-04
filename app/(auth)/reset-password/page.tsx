import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";
import { ResetPasswordContent } from "@/components/auth/reset-password-content";

export const metadata: Metadata = { title: "Choose a new password | GiveAgain" };

export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}
