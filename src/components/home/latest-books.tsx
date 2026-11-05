import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon } from "lucide-react";
import { ObjectId } from "mongodb";

import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/auth";
import { type Book } from "@/lib/books";

type ApiBook = Book & { _id: ObjectId };

async function LatestBooksGrid() {
  let latestBooks: ApiBook[];

  try {
    latestBooks = await client
      .db("bookstore")
      .collection<ApiBook>("book-nook")
      .find({})
      .sort({ _id: -1 })
      .limit(6)
      .toArray();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Please try again later.";

    return (
      <p className="py-12 text-center text-destructive">
        Could not load the latest books: {message}
      </p>
    );
  }

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
        <BookCard
          key={book._id.toHexString()}
          book={book}
          bookId={book._id.toHexString()}
        />
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
            render={<Link href="/books" />}
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
