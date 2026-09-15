import { SignOutForm } from "./sign-out-form";
import { requireSession } from "@/lib/route-guard";

export default async function Home() {
  const session = await requireSession();

  return (
    <>
      <div>
        <p>Welcome, {session.user.name}!</p>
        <p>Your email is: {session.user.email}</p>
        <p>Your username is: {session.user.username}</p>
        <p>Your first name is: {session.user.firstName}</p>
        <p>Your last name is: {session.user.lastName}</p>
        <p>Your user ID is: {session.user.id}</p>

        <SignOutForm />
      </div>
    </>
  );
}
