import type { auth } from "@/lib/auth";

type AuthResult = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export type AuthenticatedUser = Omit<AuthResult["user"], "username" | "bio"> & {
  username: string; // Makes sure it's not optional
  bio: string | null; // Makes sure it cannot be undefined
  session: AuthResult["session"]; // Makes sure it's not optional
};
