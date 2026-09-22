import { getUserByUsername } from "@/lib/data/user";
import { db } from "@/db";
import { post } from "@/db/post-schema";
import { desc, eq } from "drizzle-orm";

type UserPostsRouteContext = {
  params: Promise<{
    username: string;
  }>;
};

// Pretty sure this has been defined like 3 times throughout the project already might have to look into that
export async function GET(
  _request: Request,
  { params }: UserPostsRouteContext,
) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  // Query ALL posts for the user and return them in the response
  const posts = await db
    .select()
    .from(post)
    .where(eq(post.authorId, user.id))
    .orderBy(desc(post.createdAt));

  return Response.json(posts);
}
