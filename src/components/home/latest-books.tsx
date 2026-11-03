import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon } from "lucide-react";

import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { type Book } from "@/lib/books";

type ApiBook = Book & {
  _id: string;
};

async function LatestBooksGrid() {
  let books: ApiBook[];

  try {
    const response = await fetch("http://localhost:8000/all-books", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`The books API responded with status ${response.status}.`);
    }

    const result: unknown = await response.json();
    if (!Array.isArray(result)) {
      throw new Error("The books API returned an invalid response.");
    }
    books = result as ApiBook[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Please try again later.";

    return (
      <p className="py-12 text-center text-destructive">
        Could not load the latest books: {message}
      </p>
    );
  }

  const latestBooks = books
    .toSorted((first, second) => {
      const firstAdded = new Date(first.createdAt).getTime();
      const secondAdded = new Date(second.createdAt).getTime();
      const firstTimestamp = Number.isFinite(firstAdded) ? firstAdded : 0;
      const secondTimestamp = Number.isFinite(secondAdded) ? secondAdded : 0;

      return (
        secondTimestamp - firstTimestamp ||
        second._id.localeCompare(first._id)
      );
    })
    .slice(0, 6);

  if (latestBooks.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No books are available yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latestBooks.map((book) => (
        <BookCard key={book._id} book={book} bookId={book._id} />
      ))}
    </div>
  );
}

export function LatestBooks() {
  return (
    <section
      id="latest-books"
      aria-labelledby="latest-books-heading"
      className="py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2
            id="latest-books-heading"
            className="text-3xl font-bold text-foreground sm:text-4xl"
          >
            Recently Added Books
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Discover the newest books added to our shelves.
          </p>
        </div>

        <LatestBooksGrid />

        <div className="mt-10 flex justify-center">
          <Button
            nativeButton={false}
            render={<Link href="/all-books" />}
            size="lg"
            className="rounded-full"
          >
            <BookOpenIcon className="size-4" />
            View All Books
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
