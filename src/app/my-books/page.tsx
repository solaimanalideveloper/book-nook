import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookOpenIcon, PlusIcon } from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MyBooksTable, type MyBook } from "@/app/my-books/my-books-table";

function isMyBook(value: unknown): value is MyBook {
  if (typeof value !== "object" || value === null) return false;

  const book = value as Record<string, unknown>;
  return (
    typeof book._id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.category === "string" &&
    typeof book.addedByEmail === "string" &&
    (typeof book.image === "string" || book.image === undefined) &&
    (typeof book.description === "string" ||
      book.description === undefined) &&
    (typeof book.totalCopies === "number" ||
      typeof book.totalCopies === "string")
  );
}

async function loadMyBooks(email: string): Promise<{
  books: MyBook[];
  error?: string;
}> {
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

    const normalizedEmail = email.trim().toLowerCase();
    const books = result.filter(
      (book): book is MyBook =>
        isMyBook(book) &&
        book.addedByEmail.trim().toLowerCase() === normalizedEmail,
    );

    return { books };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Please try again later.";
    return { books: [], error: message };
  }
}

export default async function MyBooksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?callbackURL=%2Fmy-books");
  }

  const { books, error } = await loadMyBooks(session.user.email);

  return (
    <>
      <header className="border-b border-border bg-muted/40 px-4 pt-28 pb-14 text-center">
        <span className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <BookOpenIcon className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          My Books
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Books you added to the library.
        </p>
      </header>

      <section
        aria-label="Books you added"
        className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8"
      >
        <div className="mb-5 flex justify-end">
          <Button
            nativeButton={false}
            render={<Link href="/add-book" />}
          >
            <PlusIcon />
            Add Book
          </Button>
        </div>

        {error ? (
          <p role="alert" className="py-12 text-center text-destructive">
            Could not load your books: {error}
          </p>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-4 py-12 text-center sm:px-6 sm:py-16">
            <BookOpenIcon className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">You have not added any books yet</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Books you add to the library will appear here. Other members&apos;
              books will not be shown on this page.
            </p>
            <Button nativeButton={false} render={<Link href="/add-book" />}>
              Add your first book
            </Button>
          </div>
        ) : (
          <MyBooksTable initialBooks={books} />
        )}
      </section>
    </>
  );
}
