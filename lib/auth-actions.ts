import { authClient } from "@/lib/auth-client";
import type { ForgotPasswordInput, ResetPasswordInput, SignInInput, SignUpInput } from "@/schemas/auth";

const pause = () => new Promise((resolve) => setTimeout(resolve, 600));

/** Auth calls from the sign-in pages. Failures throw an Error with a short, friendly message and never say whether an account exists. */
export const authActions = {
  async signIn({ email, password }: SignInInput) {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.status === 429 ? "Too many tries. Please wait a minute and try again." : "Check your email and password, then try again.");
  },
  async signUp({ name, email, password }: SignUpInput) {
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) throw new Error(error.status === 429 ? "Too many tries. Please wait a minute and try again." : "We couldn't create that account. If you already have one, try signing in.");
  },
  async signOut() {
    await authClient.signOut();
  },
  // Not connected yet: needs an email service to send the link.
  async forgotPassword(values: ForgotPasswordInput) {
    void values;
    await pause();
  },
  async resetPassword(values: ResetPasswordInput & { token: string }) {
    void values;
    await pause();
  },
};
