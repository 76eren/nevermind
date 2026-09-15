import { auth } from "@/lib/auth";
import type { AuthenticatedUser } from "@/lib/models/AuthenticatedUser";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireGuest() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/");
  }
}

export async function requireSession(): Promise<AuthenticatedUser> {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  if (!result) {
    redirect("/login");
  }

  // Better-auth defines username as optional, but in our application it's not optional.
  const username = result.user.username;
  if (typeof username !== "string" || username.trim().length === 0) {
    redirect("/account-problem"); // Should theoretically not even be possible
  }

  return {
    ...result.user,
    username,
    bio: result.user.bio ?? null,
    session: result.session,
  };
}
