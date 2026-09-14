import { AuthPage } from "@/components/auth/auth-page";
import { LoginForm } from "./login-form";

export default function LoginPage() {
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
