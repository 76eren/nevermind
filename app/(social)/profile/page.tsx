import { AuthenticatedUser } from "@/lib/models/AuthenticatedUser";
import { requireSession } from "@/lib/route-guard";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  let user: AuthenticatedUser = await requireSession();
  redirect(`/profile/${user.username}`);
}
