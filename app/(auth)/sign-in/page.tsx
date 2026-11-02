import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFallback } from "@/components/auth/auth-fallback";
import { SignInContent } from "@/components/auth/sign-in-content";

export const metadata: Metadata = { title: "Sign in | GiveAgain" };

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <Suspense fallback={<AuthFallback />}>
      <SignInContent searchParams={searchParams} />
    </Suspense>
  );
}
