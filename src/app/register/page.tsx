import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-20 sm:px-6 sm:py-24">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-xl bg-muted" />}>
        <AuthForm mode="register" />
      </Suspense>
    </section>
  );
}
