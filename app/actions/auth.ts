"use server";

import { auth } from "@/lib/auth";
import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthActionState = { message: string | null };
function getAuthErrorMessage(error: unknown, fallback: string) {
  if (isAPIError(error) && error.statusCode < 500) {
    return error.message;
  }
  console.error("Authentication failed", error);
  return fallback;
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstname") ?? "").trim();
  const lastName = String(formData.get("lastname") ?? "").trim();

  // Store "person", not "@person".
  const username = String(formData.get("username") ?? "")
    .trim()
    .replace(/^@/, "");

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,

        // Required core Better Auth field
        name: `${firstName} ${lastName}`.trim(),

        // Additional fields defined in the Better Auth configuration
        firstName,
        lastName,

        // Added by the username plugin
        username,
      },
    });
  } catch (error) {
    return {
      message: getAuthErrorMessage(
        error,
        "Could not create your account. Please try again.",
      ),
    };
  }

  redirect("/");
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    return {
      message: getAuthErrorMessage(
        error,
        "Could not sign in. Please try again.",
      ),
    };
  }

  redirect("/");
}

export async function signOutAction(
  _previousState: AuthActionState,
  _formData: FormData,
): Promise<AuthActionState> {
  void _previousState;
  void _formData;

  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    return {
      message: getAuthErrorMessage(
        error,
        "Could not sign out. Please try again.",
      ),
    };
  }

  redirect("/");
}
