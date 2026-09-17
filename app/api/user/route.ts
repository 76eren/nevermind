import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// TODO: Consider moving this to a models folder
type UserResponse = {
  firstName: string;
  lastName: string;
  username: string;
  bio: string | null;
  image: string | null;
  banner: string | null;
};
export async function GET(request: NextRequest) {
  let username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return Response.json(
      {
        message: "Username is required.",
      },
      {
        status: 400,
      },
    );
  }

  const userRecord = await db.query.user.findFirst({
    where: eq(user.username, username),
  });

  if (!userRecord) {
    return NextResponse.json(
      {
        message: "User not found.",
      },
      {
        status: 404,
      },
    );
  }

  const userResponse: UserResponse = {
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
    username: userRecord.username,
    bio: userRecord.bio,
    image: userRecord.image,
    banner: userRecord.banner,
  };

  return NextResponse.json(userResponse);
}

// Reason I have this is because not all properties CAN be changed
type UpdateUserRequest = {
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
  const body = (await request.json()) as UpdateUserRequest;
  let currentUser = session.user;

  // Overwrite all properties of currentUser with all existing properties of body that are not null or undefined
  currentUser = {
    ...currentUser,
    ...Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) => value !== null && value !== undefined,
      ),
    ),
  };

  const [updatedUser] = await db
    .update(user)
    .set({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      bio: currentUser.bio,
      banner: currentUser.banner,
      image: currentUser.image,
    })
    .where(eq(user.id, session.user.id))
    .returning();

  // TODO: If the profile picture or banner image is updated, we need to update it on min/io too.

  return NextResponse.json(updatedUser);
}
