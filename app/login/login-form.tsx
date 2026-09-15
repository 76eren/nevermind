"use client";

import { useState } from "react";
import type { SubmitEventHandler } from "react";
import {
  AuthField,
  AuthFormError,
  AuthSubmitButton,
  PasswordField,
} from "@/components/auth/auth-form-controls";
import { signInAction } from "../actions/auth";

type LoginResponse = {
  message: string;
};

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(data.message);
        return;
      }
    } catch {
      setError("The server could not be reached. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-10" action={signInAction}>
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

      <AuthFormError message={error} />

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Sign in"
        submittingLabel="Signing in..."
      />
    </form>
  );
}
