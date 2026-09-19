import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/data/user";
import {
  uploadBanner,
  uploadProfilePicture,
} from "@/lib/storage/images-upload";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { message: "Username is required." },
      { status: 400 },
    );
  }

  const userResponse = await getUserByUsername(username);

  if (!userResponse) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json(userResponse);
}

// Reason I have this is because not all properties CAN be changed
export type UpdateUserRequest = {
  name?: string;
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  profilePictureImage?: File | null;
  profileBannerImage?: File | null;
};
export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in." },
      { status: 401 },
    );
  }
  const body = (
    request.headers.get("content-type")?.startsWith("multipart/form-data")
      ? Object.fromEntries(await request.formData())
      : await request.json()
  ) as UpdateUserRequest;

  const updates: Partial<typeof user.$inferInsert> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.firstName !== undefined) updates.firstName = body.firstName;
  if (body.lastName !== undefined) updates.lastName = body.lastName;
  if (body.bio !== undefined) updates.bio = body.bio;

  if (body.profilePictureImage) {
    const uploadedImage = await uploadProfilePicture(
      session.user.id,
      body.profilePictureImage,
    );
    updates.image = uploadedImage.objectKey;
  }

  if (body.profileBannerImage) {
    const uploadedImage = await uploadBanner(
      session.user.id,
      body.profileBannerImage,
    );
    updates.banner = uploadedImage.objectKey;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(session.user);
  }

  const [updatedUser] = await db
    .update(user)
    .set(updates)
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json(updatedUser);
}
