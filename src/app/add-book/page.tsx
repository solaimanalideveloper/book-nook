import { Suspense } from "react";

import { AddBookForm } from "@/app/add-book/add-book-form";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AddBookPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      }
    >
      <ProtectedRoute
        returnTo="/add-book"
        unauthenticatedTo="/register?callbackURL=%2Fadd-book"
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
              <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
                <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="h-9 animate-pulse rounded bg-muted" />
                  <div className="h-9 animate-pulse rounded bg-muted" />
                  <div className="h-9 animate-pulse rounded bg-muted" />
                  <div className="h-9 animate-pulse rounded bg-muted" />
                  <div className="h-24 animate-pulse rounded bg-muted sm:col-span-2" />
                  <div className="h-12 animate-pulse rounded bg-muted sm:col-span-2" />
                </div>
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
