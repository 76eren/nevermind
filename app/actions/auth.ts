"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstname") ?? "").trim();
  const lastName = String(formData.get("lastname") ?? "").trim();

  // Store "person", not "@person".
  const username = String(formData.get("username") ?? "")
    .trim()
    .replace(/^@/, "");

  const result = await auth.api.signUpEmail({
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

  redirect("/");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}
