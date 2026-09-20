import { db } from "@/db";
import { post } from "@/db/post-schema";
import { requireSession } from "@/lib/route-guard";

// TODO: also needs image later on
type PostRequest = {
  message: string;
};
export async function POST(request: Request) {
  const body = (await request.json()) as PostRequest;

  const content = body.message.trim();

  if (!content || body.message.length > 280) {
    throw new Error("Post must be between 1 and 280 characters.");
  }

  const author = await requireSession();
  const now = new Date();
  const id = crypto.randomUUID();

  await db.insert(post).values({
    id,
    content,
    authorId: author.id,
    createdAt: now,
    updatedAt: now,
  });

  return new Response(JSON.stringify({ id }), { status: 201 });
}
