"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditProfileForm } from "./edit-profile/edit-profile-form";
import { updateProfile } from "./edit-profile/update-profile";

type ProfileHeaderProps = {
  name: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
  bannerUrl?: string | null;
  isOwnProfile?: boolean;
};
export function ProfileHeader({
  name,
  username,
  firstName = "",
  lastName = "",
  bio,
  profilePictureUrl,
  bannerUrl,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const initialValues = {
    name,
    firstName,
    lastName,
    bio: bio ?? "",
  };

  return (
    <>
      <section className="w-full overflow-hidden border-x border-gray-200 bg-white">
        <header className="flex h-[90px] items-center gap-6 px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="grid size-10 shrink-0 place-items-center rounded-full text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft className="size-5" strokeWidth={1.8} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-950">{name}</h1>
            <p className="mt-0.5 text-sm text-gray-500">Profile</p>
          </div>
        </header>

        <div className="relative h-48 w-full bg-gray-200 sm:h-64">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={`${name}'s profile banner`}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400" />
          )}
        </div>

        <div className="relative px-5 pb-8 sm:px-7">
          <div className="absolute left-5 top-0 -translate-y-1/2 sm:left-7">
            <div className="size-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 sm:size-36">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={`${name}'s profile picture`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center bg-slate-200 text-4xl font-bold text-slate-500">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-20 justify-end pt-4 sm:min-h-24">
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="h-11 rounded-full border border-gray-300 px-6 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
              >
                Edit profile
              </button>
            )}
          </div>

          <div className="mt-3 max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
              {name}
            </h2>

            <p className="mt-1 text-base text-gray-500">@{username}</p>

            {bio && (
              <p className="mt-4 whitespace-pre-line text-[15px] leading-6 text-gray-800">
                {bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {isEditing && isOwnProfile && (
        <EditProfileForm
          initialValues={initialValues}
          profilePictureUrl={profilePictureUrl}
          bannerUrl={bannerUrl}
          onClose={() => setIsEditing(false)}
          onApply={async (values) => {
            await updateProfile(values, initialValues);
            setIsEditing(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
