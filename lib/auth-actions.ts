import type { ForgotPasswordInput, ResetPasswordInput, SignInInput, SignUpInput } from "@/schemas/auth";

/**
 * Stand-ins for the Better Auth client calls. Each should throw an Error with a
 * short, friendly message on failure. Replace the bodies once /api/auth exists.
 */
const pause = () => new Promise((resolve) => setTimeout(resolve, 600));

export const authActions = {
  async signIn(values: SignInInput) {
    void values;
    await pause();
  },
  async signUp(values: SignUpInput) {
    void values;
    await pause();
  },
  async forgotPassword(values: ForgotPasswordInput) {
    void values;
    await pause();
  },
  async resetPassword(values: ResetPasswordInput & { token: string }) {
    void values;
    await pause();
  },
};
