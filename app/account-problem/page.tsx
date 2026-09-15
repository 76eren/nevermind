// I don't even think it's possible to get into this page

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutForm } from "../sign-out-form";

export default async function AccountProblemPage() {
  const result = await auth.api.getSession({ headers: await headers() });

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
      <SignOutForm />
    </main>
  );
}
