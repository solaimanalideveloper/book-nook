import { Suspense } from "react";
import type { Metadata } from "next";
import { BookOpenIcon } from "lucide-react";

import { BookCard } from "@/components/books/book-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { type Book } from "@/lib/books";
import { getApiUrl } from "@/lib/api-url";

export const metadata: Metadata = {
  title: "All Books",
};

type ApiBook = Book & {
  _id: string;
};

async function loadBooks(): Promise<{ books?: ApiBook[]; error?: string }> {
  try {
    const response = await fetch(getApiUrl("/all-books"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`The books API responded with status ${response.status}.`);
    }

    const books = (await response.json()) as ApiBook[];
    if (!Array.isArray(books)) {
      throw new Error("The books API returned an invalid response.");
    }

    return { books };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Please try again later.";

    return { error: message };
  }
}

async function BooksGrid() {
  const { books, error } = await loadBooks();

  if (error) {
    return (
      <p className="col-span-full py-16 text-center text-destructive">
        Could not load books: {error}
      </p>
    );
  }

  if (!books?.length) {
    return (
      <p className="col-span-full py-16 text-center text-muted-foreground">
        No books are available yet.
      </p>
    );
  }

  return books.map((book) => (
    <BookCard key={book._id} book={book} bookId={book._id} />
  ));
}

export default function AllBooksPage() {
  return (
    <>
      <header className="border-b border-border bg-muted/40 px-4 pt-28 pb-14 text-center">
        <span className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <BookOpenIcon className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          All Books
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every book on the BookNook shelf.
        </p>
      </header>

      <section
        aria-label="All books"
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3"
      >
        <Suspense
          fallback={
            <div className="col-span-full py-16">
              <LoadingSpinner label="Loading books..." />
            </div>
          }
        >
          <BooksGrid />
        </Suspense>
      </section>
    </>
  );
}
