import Link from "next/link";
import { RegisterForm } from "./register-form";
import { requireGuest } from "@/lib/route-guard";

export default async function RegisterPage() {
  await requireGuest();

  return (
    <>
      <h2 className="font-serif text-4xl font-bold tracking-tight">
        Create your Nevermind account
      </h2>

      <RegisterForm />

      <p className="mt-7 text-center text-xs text-[#8c979d]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#10bec1] transition hover:text-[#5be1e3]"
        >
          Login to your account
        </Link>
      </p>
    </>
  );
}
