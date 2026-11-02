"use client";

import { useRouter } from "next/navigation";
import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/shares/input";
import { PasswordInput } from "@/components/shares/password-input";
import { useAuthForm } from "@/hooks/use-auth-form";
import { authActions } from "@/lib/auth-actions";
import { signUpSchema } from "@/schemas/auth";

export function SignUpForm({ next }: { next: string }) {
  const router = useRouter();
  const { form, onSubmit, formError, isSubmitting } = useAuthForm({
    schema: signUpSchema,
    defaultValues: { name: "", email: "", password: "" },
    submit: authActions.signUp,
    onDone: () => router.push(next),
  });
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={formError} />
      <Input label="Your name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <PasswordInput
        label="Password"
        hint="At least 8 characters."
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <SubmitButton label="Create account" pending={isSubmitting} />
    </form>
  );
}
