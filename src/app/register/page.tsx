import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-24">
      <AuthForm mode="register" />
    </section>
  );
}
