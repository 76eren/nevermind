import { AuthPage } from "@/components/auth/auth-page";
import { LoginForm } from "./login-form";
import { requireGuest } from "@/lib/route-guard";

export default async function LoginPage() {
  await requireGuest();

  return (
    <AuthPage
      title="Sign in to Nevermind"
      alternateAction={{
        prompt: "New to Nevermind?",
        href: "/register",
        label: "Create an account",
      }}
    >
      <LoginForm />
    </AuthPage>
  );
}
