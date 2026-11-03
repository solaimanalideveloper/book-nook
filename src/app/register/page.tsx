import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-24">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-xl bg-muted" />}>
        <AuthForm mode="register" />
      </Suspense>
    </section>
  );
}
