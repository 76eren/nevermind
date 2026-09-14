"use client";

import { useState } from "react";
import type { SubmitEventHandler } from "react";
import {
  AuthField,
  AuthFormError,
  AuthSubmitButton,
  PasswordField,
} from "@/components/auth/auth-form-controls";

type RegisterResponse = {
  message: string;
};

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    const firstName = formData.get("Firstname");
    const lastName = formData.get("Lastname");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          firstname: firstName,
          lastname: lastName,
        }),
      });

      const data = (await response.json()) as RegisterResponse;

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
    <form className="mt-10" onSubmit={handleSubmit}>
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
        name="Firstname"
        type="text"
        placeholder="Sonia"
        autoComplete="given-name"
        required
        disabled={isSubmitting}
      />

      <AuthField
        label="Last name"
        name="Lastname"
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

      <AuthFormError message={error} />

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Create account"
        submittingLabel="Creating account..."
      />
    </form>
  );
}
