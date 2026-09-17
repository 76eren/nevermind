import { ProfileHeader } from "@/components/profile/profile-header";
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

  return (
    <>
      <div className="mx-auto w-full max-w-6xl xl:w-[calc(100vw-36rem-4rem)] xl:-translate-x-36">
        <ProfileHeader
          name={user.name}
          username={user.username}
          bio={user.bio}
          profilePictureUrl={user.image ? `/api/images/${user.image}` : null}
          bannerUrl={user.banner ? `/api/images/${user.banner}` : null}
          isOwnProfile={user.username === username}
        />
      </div>
    </>
  );
}
