import "server-only";

import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";

export type UserResponse = {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string | null;
  image: string | null;
  banner: string | null;
};

export async function getUserByUsername(
  username: string,
): Promise<UserResponse | null> {
  const userRecord = await db.query.user.findFirst({
    columns: {
      name: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      image: true,
      banner: true,
    },
    where: eq(user.username, username),
  });

  return userRecord ?? null;
}
