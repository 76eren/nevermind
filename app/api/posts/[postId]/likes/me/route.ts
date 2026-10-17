import { requireSession } from "@/lib/route-guard";
import { db } from "@/db";
import { post } from "@/db/post-schema";
import { and, eq, SQL } from "drizzle-orm";
import { postLikes } from "@/db/post-likes-schema";

type PostParam = {
  params: Promise<{
    postId: string;
  }>;
};

export async function PUT(_request: Request, { params }: PostParam) {
  const { postId } = await params;
  const user = await requireSession();

  // validate that the post exists
  const [postToLike] = await db
    .select()
    .from(post)
    .where(eq(post.id, postId))
    .limit(1);

  if (!postToLike) {
    return Response.json({ message: "Post not found." }, { status: 404 });
  }

  // Now we add to post_likes table
  await db
    .insert(postLikes)
    .values({
      userId: user.id,
      postId,
      createdAt: new Date(),
    })
    .onConflictDoNothing({
      target: [postLikes.userId, postLikes.postId],
    });

  return Response.json(
    { message: "Post liked successfully." },
    { status: 200 },
  );
}

export async function DELETE(_request: Request, { params }: PostParam) {
  const { postId } = await params;
  const user = await requireSession();

  const filters: SQL[] = [];
  filters.push(eq(postLikes.userId, user.id));
  filters.push(eq(postLikes.postId, postId));

  // Now we remove from post_likes table
  await db.delete(postLikes).where(and(...filters));

  return Response.json(
    { message: "Post unliked successfully." },
    { status: 200 },
  );
}
