"use client";

import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/shares/input";
import { useAuthForm } from "@/hooks/use-auth-form";
import { authActions } from "@/lib/auth-actions";
import { forgotPasswordSchema } from "@/schemas/auth";

export function ForgotPasswordForm() {
  const { form, onSubmit, formError, done, isSubmitting } = useAuthForm({
    schema: forgotPasswordSchema,
    defaultValues: { email: "" },
    submit: authActions.forgotPassword,
  });
  const { register, formState: { errors } } = form;

  if (done) {
    return (
      <p role="status" className="border border-line bg-mist p-4">
        If that email has an account, we&rsquo;ve sent a link to reset your password. Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={formError} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <SubmitButton label="Send reset link" pending={isSubmitting} />
    </form>
  );
}
