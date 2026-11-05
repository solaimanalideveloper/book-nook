import { Suspense } from "react";
import type { Metadata } from "next";

import { AddBookForm } from "@/app/add-book/add-book-form";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
          <LoadingSpinner label="Loading the add-book form..." />
        </div>
      }
    >
      <ProtectedRoute
        returnTo="/add-book"
        unauthenticatedTo="/login?callbackURL=%2Fadd-book"
      >
        <>
          <div className="border-b border-border bg-muted/40 pt-28 pb-14">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Add a Book
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Put a book from your shelf into the library.
              </p>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
                <LoadingSpinner label="Loading the add-book form..." />
              </div>
            }
          >
            <AddBookForm />
          </Suspense>
        </>
      </ProtectedRoute>
    </Suspense>
  );
}
