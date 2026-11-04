import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";
import { SignUpContent } from "@/components/auth/sign-up-content";

export const metadata: Metadata = { title: "Create an account | GiveAgain" };

export default function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignUpContent searchParams={searchParams} />
    </Suspense>
  );
}
