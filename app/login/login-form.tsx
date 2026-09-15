"use client";

import { useActionState } from "react";
import {
  AuthField,
  AuthFormError,
  AuthSubmitButton,
  PasswordField,
} from "@/components/auth/auth-form-controls";
import { signInAction } from "../actions/auth";

export function LoginForm() {
  const [state, formAction, isSubmitting] = useActionState(signInAction, {
    message: null as string | null,
  });

  return (
    <form className="mt-10" action={formAction}>
      <AuthField
        label="Email"
        name="email"
        type="email"
        placeholder="s.nevermind@mail.com"
        autoComplete="email"
        required
        disabled={isSubmitting}
      />

      <PasswordField
        label="Password"
        name="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        required
        disabled={isSubmitting}
      />

      <AuthFormError message={isSubmitting ? null : state.message} />

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Sign in"
        submittingLabel="Signing in..."
      />
    </form>
  );
}
