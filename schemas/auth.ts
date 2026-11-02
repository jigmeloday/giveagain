import { z } from "zod";

const email = z.string().trim().min(1, "Enter your email.").pipe(z.email("Enter a valid email, like name@example.com."));
const password = z.string().min(8, "Use at least 8 characters.").max(128, "Keep it under 128 characters.");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(60, "Keep your name under 60 characters."),
  email,
  password,
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirm: z.string().min(1, "Type the password again.") })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "The passwords don't match." });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
