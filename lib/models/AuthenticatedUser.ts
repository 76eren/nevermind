import type { auth } from "@/lib/auth";

type AuthResult = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export type AuthenticatedUser = Omit<AuthResult["user"], "username"> & {
  username: string;
  session: AuthResult["session"];
};
