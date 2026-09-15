"use client";

import { useActionState } from "react";
import { AuthFormError } from "@/components/auth/auth-form-controls";
import { signOutAction } from "./actions/auth";

export function SignOutForm() {
  const [state, formAction, isSubmitting] = useActionState(signOutAction, {
    message: null as string | null,
  });

  return (
    <form action={formAction}>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing out..." : "Sign Out"}
      </button>
      <AuthFormError message={isSubmitting ? null : state.message} />
    </form>
  );
}
