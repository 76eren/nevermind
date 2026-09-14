import { AuthPage } from "@/components/auth/auth-page";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <AuthPage
      title="Create your Nevermind account"
      alternateAction={{
        prompt: "Already have an account?",
        href: "/login",
        label: "Login to your account",
      }}
    >
      <RegisterForm />
    </AuthPage>
  );
}
