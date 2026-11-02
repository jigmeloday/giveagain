import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFallback } from "@/components/auth/auth-fallback";
import { SignUpContent } from "@/components/auth/sign-up-content";

export const metadata: Metadata = { title: "Create an account | GiveAgain" };

export default function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  return (
    <Suspense fallback={<AuthFallback />}>
      <SignUpContent searchParams={searchParams} />
    </Suspense>
  );
}
