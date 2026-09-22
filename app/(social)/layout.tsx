import { Navbar } from "@/components/navigation/navbar";
import { requireSession } from "@/lib/route-guard";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Nevermind",
  description: "Your social media platform",
};

export default async function SocialLayout({ children }: LayoutProps<"/">) {
  const user = await requireSession();

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <Navbar
        username={user.username}
        firstname={user.firstName}
        lastname={user.lastName}
        userId={user.id}
        profilePictureUrl={user.image || null}
      />

      <main className="min-w-0 flex-1 px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
