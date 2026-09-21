import { db } from "@/db";
import { post } from "@/db/post-schema";
import { requireSession } from "@/lib/route-guard";
import { UploadedImage, uploadPostImage } from "@/lib/storage/images-upload";

export async function POST(request: Request) {
  const formData = await request.formData();

  const message = formData.get("message");
  const image = formData.get("image");

  console.log("Received post request:", { message, image });

  const content = message?.toString().trim();

  if (!content || content.length > 280) {
    throw new Error("Post must be between 1 and 280 characters.");
  }

  const author = await requireSession();
  const now = new Date();
  const id = crypto.randomUUID();
  let uploadedImage: UploadedImage | null = null;

  if (image) {
    uploadedImage = await uploadPostImage(author.id, image as File);
  }

  await db.insert(post).values({
    id,
    content,
    authorId: author.id,
    createdAt: now,
    updatedAt: now,
    image: image ? (uploadedImage?.objectKey as string) : null,
  });

  return new Response(JSON.stringify({ id }), { status: 201 });
}
