import { ProfileHeader } from "@/components/profile/header/profile-header";
import PostsView from "@/components/profile/posts/PostsView";
import { getUserByUsername } from "@/lib/data/user";
import { AuthenticatedUser } from "@/lib/models/AuthenticatedUser";
import { requireSession } from "@/lib/route-guard";
import { connection } from "next/server";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function Profile({ params }: ProfilePageProps) {
  const user: AuthenticatedUser = await requireSession();
  const { username } = await params;

  await connection();

  const profile = await getUserByUsername(username);
  if (!profile) {
    return <div>User not found</div>;
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl xl:w-[calc(100vw-36rem-4rem)] xl:-translate-x-36">
        <ProfileHeader
          id={profile.id}
          name={profile.name}
          username={profile.username}
          firstName={profile.firstName}
          lastName={profile.lastName}
          bio={profile.bio}
          profilePictureUrl={profile.image}
          bannerUrl={profile.banner}
          isOwnProfile={user.username === profile.username}
        />
      </div>

      <PostsView />
    </>
  );
}
