"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWatch } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { SubmitButton } from "@/components/auth/submit-button";
import { Checkbox } from "@/components/shares/checkbox";
import { FormField } from "@/components/shares/form-field";
import { Input } from "@/components/shares/input";
import { PasswordInput } from "@/components/shares/password-input";
import { useSubmitForm } from "@/hooks/use-submit-form";
import { authActions } from "@/lib/auth-actions";
import { signUpSchema } from "@/schemas/auth";

export function SignUpForm({ next }: { next: string }) {
  const router = useRouter();
  const { form, onSubmit, formError, isSubmitting } = useSubmitForm({
    schema: signUpSchema,
    defaultValues: { name: "", email: "", password: "", agree: false },
    submit: authActions.signUp,
    onDone: () => {
      router.push(next);
      router.refresh();
    },
  });
  const { control, register, formState: { errors } } = form;
  const password = useWatch({ control, name: "password" });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={formError} />
      <Input label="Your name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <div className="flex flex-col gap-2">
        <PasswordInput label="Password" placeholder="At least 8 characters" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
        <PasswordStrengthMeter password={password ?? ""} />
      </div>
      <FormField control={control} name="agree" render={({ field, error }) => (
        <Checkbox
          label={<>I&rsquo;ll follow the <Link href="/how-it-works" className="font-bold text-primary-ink underline">community guidelines</Link>: be kind, be honest, never charge for anything.</>}
          error={error}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      )} />
      <SubmitButton label="Create account" pending={isSubmitting} />
    </form>
  );
}
