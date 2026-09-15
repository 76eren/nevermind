import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignOutForm } from "./sign-out-form";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {session ? (
        <div>
          <p>Welcome, {session.user.name}!</p>
          <p>Your email is: {session.user.email}</p>
          <p>Your username is: {session.user.username}</p>
          <p>Your first name is: {session.user.firstName}</p>
          <p>Your last name is: {session.user.lastName}</p>
          <p>Your user ID is: {session.user.id}</p>

          <SignOutForm />
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </>
  );
}
