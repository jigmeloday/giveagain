"use client";

import Link from "next/link";
import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { PasswordInput } from "@/components/shares/password-input";
import { buttonVariants } from "@/components/ui/button";
import { useAuthForm } from "@/hooks/use-auth-form";
import { authActions } from "@/lib/auth-actions";
import { resetPasswordSchema } from "@/schemas/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const { form, onSubmit, formError, done, isSubmitting } = useAuthForm({
    schema: resetPasswordSchema,
    defaultValues: { password: "", confirm: "" },
    submit: (values) => authActions.resetPassword({ ...values, token }),
  });
  const { register, formState: { errors } } = form;

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <p role="status" className="border border-line bg-mist p-4">Your password is changed. You can sign in now.</p>
        <Link href="/sign-in" className={buttonVariants({ size: "lg" })}>Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={formError} />
      <PasswordInput label="New password" hint="At least 8 characters." autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <PasswordInput label="Type it again" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
      <SubmitButton label="Change password" pending={isSubmitting} />
    </form>
  );
}
