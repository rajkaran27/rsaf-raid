import SignupForm from "@/components/SignupForm";
import LoginForm from "@/components/LoginForm";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />

      <SignupForm />
    </div>
  );
}
