import { Suspense } from "react";
import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-20 sm:px-6 sm:py-24">
      <Suspense fallback={<LoadingSpinner label="Loading registration..." />}>
        <AuthForm mode="register" />
      </Suspense>
    </section>
  );
}
