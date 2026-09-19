import Link from "next/link";
import { LoginForm } from "./login-form";
import { requireGuest } from "@/lib/route-guard";

export default async function LoginPage() {
  await requireGuest();

  return (
    <>
      <h2 className="font-serif text-4xl font-bold tracking-tight">
        Sign in to Nevermind
      </h2>

      <LoginForm />

      <p className="mt-7 text-center text-xs text-[#8c979d]">
        New to Nevermind?{" "}
        <Link
          href="/register"
          className="text-[#10bec1] transition hover:text-[#5be1e3]"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
