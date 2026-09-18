import { ProfileHeader } from "@/components/profile/profile-header";
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
          name={profile.name}
          username={profile.username}
          bio={profile.bio}
          profilePictureUrl={profile.image ? `/api/images/${profile.image}` : null}
          bannerUrl={profile.banner ? `/api/images/${profile.banner}` : null}
          isOwnProfile={user.username === profile.username}
        />
      </div>
    </>
  );
}
