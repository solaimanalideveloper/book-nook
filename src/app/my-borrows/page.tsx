import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookOpenIcon, CalendarDaysIcon } from "lucide-react";
import { ObjectId } from "mongodb";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth, client } from "@/lib/auth";
import { formatDate } from "@/lib/books";

type BorrowRecord = {
  bookId: string;
  bookTitle: string;
  borrowedAt: Date | string;
  dueAt: Date | string;
};

type BorrowedBookDetails = {
  _id: ObjectId;
  title?: string;
  author?: string;
  category?: string;
  image?: string;
  description?: string;
};

async function MyBorrowsContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?callbackURL=%2Fmy-borrows");
  }

  const borrowRecords = await client
    .db("bookstore")
    .collection<BorrowRecord>("book-borrows")
    .find({ userId: session.user.id, status: "borrowed" })
    .sort({ borrowedAt: -1 })
    .toArray();

  const bookIds = borrowRecords
    .map(({ bookId }) => bookId)
    .filter(ObjectId.isValid)
    .map((bookId) => new ObjectId(bookId));

  const books = await client
    .db("bookstore")
    .collection<BorrowedBookDetails>("book-nook")
    .find({ _id: { $in: bookIds } })
    .toArray();

  const booksById = new Map(
    books.map((book) => [book._id.toHexString(), book]),
  );

  return (
    <>
      <header className="border-b border-border bg-muted/40 px-4 pt-28 pb-14 text-center">
        <span className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <BookOpenIcon className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          My Borrows
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Books you have borrowed, with their due dates.
        </p>
      </header>

      <section
        aria-label="Books you borrowed"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6"
      >
        {borrowRecords.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-4 py-12 text-center sm:px-6 sm:py-16">
            <BookOpenIcon className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">You have no active borrows</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Books you borrow will appear here. Only your own borrowed books
              are shown.
            </p>
            <Button nativeButton={false} render={<Link href="/all-books" />}>
              Browse books
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {borrowRecords.map((borrow, index) => {
              const book = booksById.get(borrow.bookId);
              const title = book?.title || borrow.bookTitle || "Borrowed book";

              return (
                <Card
                  key={`${borrow.bookId}-${new Date(borrow.borrowedAt).getTime()}-${index}`}
                  className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)]"
                >
                  <Link
                    href={`/all-books/${encodeURIComponent(borrow.bookId)}`}
                    aria-label={`View ${title}`}
                    className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted"
                  >
                    {book?.image ? (
                      <Image
                        src={book.image}
                        alt={`Cover of ${title}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                        <BookOpenIcon className="size-7" />
                        No cover
                      </span>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-col gap-2">
                    <Badge variant="secondary" className="w-fit">
                      {book?.category || "Borrowed"}
                    </Badge>
                    <h2 className="line-clamp-2 text-base font-bold text-foreground">
                      {title}
                    </h2>
                    <p className="truncate text-sm text-muted-foreground">
                      {book?.author || "BookNook member"}
                    </p>
                    {book?.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {book.description}
                      </p>
                    )}
                    <div className="mt-auto space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="size-3.5 shrink-0" />
                        Borrowed {formatDate(borrow.borrowedAt)}
                      </p>
                      <p className="flex flex-wrap items-center gap-1.5">
                        <CalendarDaysIcon className="size-3.5 shrink-0" />
                        Due {formatDate(borrow.dueAt)}
                        <Badge variant="outline" className="ml-auto">
                          Borrowed
                        </Badge>
                      </p>
                    </div>
                    <Button
                      nativeButton={false}
                      render={
                        <Link
                          href={`/all-books/${encodeURIComponent(borrow.bookId)}`}
                        />
                      }
                      variant="outline"
                      size="sm"
                      className="mt-1 w-full"
                    >
                      View book
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default function MyBorrowsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[65svh] animate-pulse bg-muted/30" />
      }
    >
      <MyBorrowsContent />
    </Suspense>
  );
}
