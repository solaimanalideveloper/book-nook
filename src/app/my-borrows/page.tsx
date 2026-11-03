import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeftRightIcon } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";

export default function MyBorrowsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/30" />}>
      <ProtectedRoute returnTo="/my-borrows">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-foreground">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ArrowLeftRightIcon className="size-6" />
          </span>
          <h1 className="text-3xl font-bold">My Borrows</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Track what you have borrowed — coming soon.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="rounded-full"
          >
            Back to Home
          </Button>
        </div>
      </ProtectedRoute>
    </Suspense>
  );
}
