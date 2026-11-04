import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";
import { SignInContent } from "@/components/auth/sign-in-content";

export const metadata: Metadata = { title: "Sign in | GiveAgain" };

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignInContent searchParams={searchParams} />
    </Suspense>
  );
}
