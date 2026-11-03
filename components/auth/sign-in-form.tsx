"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/shares/input";
import { PasswordInput } from "@/components/shares/password-input";
import { useSubmitForm } from "@/hooks/use-submit-form";
import { authActions } from "@/lib/auth-actions";
import { signInSchema } from "@/schemas/auth";

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const { form, onSubmit, formError, isSubmitting } = useSubmitForm({
    schema: signInSchema,
    defaultValues: { email: "", password: "" },
    submit: authActions.signIn,
    onDone: () => {
      router.push(next);
      router.refresh();
    },
  });
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={formError} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <PasswordInput label="Password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
      <Link href="/forgot-password" className="w-fit text-sm font-bold text-primary-ink hover:underline">Forgot your password?</Link>
      <SubmitButton label="Sign in" pending={isSubmitting} />
    </form>
  );
}
