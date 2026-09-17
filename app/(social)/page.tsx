import { AuthenticatedUser } from "@/lib/models/AuthenticatedUser";
import { requireSession } from "@/lib/route-guard";

export default async function Home() {
  const user: AuthenticatedUser = await requireSession();

  return (
    <>
      <div>
        <p>Welcome, {user.name}!</p>
        <p>Your email is: {user.email}</p>
        <p>Your username is: {user.username}</p>
        <p>Your first name is: {user.firstName}</p>
        <p>Your last name is: {user.lastName}</p>
        <p>Your user ID is: {user.id}</p>
      </div>
    </>
  );
}
