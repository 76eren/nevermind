import { getUserByUsername } from "@/lib/data/user";
import { db } from "@/db";
import { post } from "@/db/post-schema";
import { desc, eq, sql } from "drizzle-orm";
import { postLikes } from "@/db/post-likes-schema";
import { requireSession } from "@/lib/route-guard";

type UserPostsRouteContext = {
  params: Promise<{
    username: string;
  }>;
};

// TODO: deifne a proper response schema for this route.
export async function GET(
  _request: Request,
  { params }: UserPostsRouteContext,
) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  // This is the logged in user and NOT the post author. Will be used to determine if the logged in user has liked the post or not.
  const self = await requireSession();

  // Query ALL posts for the user and return them in the response
  const posts = await db
    .select({
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      likeCount: db.$count(postLikes, eq(postLikes.postId, post.id)),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      image: post.image,
      isLiked: sql<boolean>`
      exists (
        select 1
        from ${postLikes}
        where ${postLikes.postId} = ${post.id}
          and ${postLikes.userId} = ${self.id}
      )
    `,
    })
    .from(post)
    .where(eq(post.authorId, user.id))
    .orderBy(desc(post.createdAt));

  return Response.json(posts);
}
