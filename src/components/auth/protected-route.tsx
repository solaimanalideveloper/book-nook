import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function ProtectedRoute({
  children,
  returnTo,
}: {
  children: ReactNode;
  returnTo: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/login?callbackURL=${encodeURIComponent(returnTo)}`);
  }

  return children;
}
