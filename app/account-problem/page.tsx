// I don't even think it's possible to get into this page

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { signOutAction } from "../actions/auth";

export default async function AccountProblemPage() {
  const result = await auth.api.getSession({ headers: await headers() });
  const [state, formAction, isSubmitting] = useActionState(signOutAction, {
    message: null as string | null,
  });

  if (!result) {
    redirect("/login");
  }

  if (typeof result.user.username === "string" && result.user.username.trim()) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">We could not load your account</h1>
      <p>Your username is missing. Sign out and try again.</p>

      <form action={formAction}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing out..." : "Sign Out"}
        </button>
        {!isSubmitting && state.message && (
          <p
            role="alert"
            aria-live="polite"
            className="mt-4 text-sm text-red-400"
          >
            {state.message}
          </p>
        )}
      </form>
    </main>
  );
}
