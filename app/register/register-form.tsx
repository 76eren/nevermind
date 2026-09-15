"use client";

import { useActionState } from "react";
import {
  AuthField,
  AuthFormError,
  AuthSubmitButton,
  PasswordField,
} from "@/components/auth/auth-form-controls";
import { signUpAction } from "../actions/auth";

export function RegisterForm() {
  const [state, formAction, isSubmitting] = useActionState(signUpAction, {
    message: null as string | null,
  });

  return (
    <form className="mt-10" action={formAction}>
      <AuthField
        label="Username"
        name="username"
        type="text"
        placeholder="s.nevermind"
        autoComplete="username"
        required
        disabled={isSubmitting}
      />

      <AuthField
        label="Email"
        name="email"
        type="email"
        placeholder="s.nevermind@mail.com"
        autoComplete="email"
        required
        disabled={isSubmitting}
      />

      <AuthField
        label="First Name"
        name="firstname"
        type="text"
        placeholder="Sonia"
        autoComplete="given-name"
        required
        disabled={isSubmitting}
      />

      <AuthField
        label="Last name"
        name="lastname"
        type="text"
        placeholder="Nevermind"
        autoComplete="family-name"
        required
        disabled={isSubmitting}
      />

      <PasswordField
        label="Password"
        name="password"
        placeholder="Enter the password you would like to use"
        autoComplete="new-password"
        required
        disabled={isSubmitting}
      />

      <AuthFormError message={isSubmitting ? null : state.message} />

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Create account"
        submittingLabel="Creating account..."
      />
    </form>
  );
}
