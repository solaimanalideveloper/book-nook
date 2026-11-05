import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookOpenIcon } from "lucide-react";
import { ObjectId } from "mongodb";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReturnBookButton } from "@/app/my-borrows/return-book-button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { auth, client } from "@/lib/auth";
import { formatDate } from "@/lib/books";

export const metadata: Metadata = {
  title: "My Borrows",
};

type BorrowRecord = {
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  bookCategory?: string;
  bookImage?: string;
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
            <Button nativeButton={false} render={<Link href="/books" />}>
              Browse books
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:hidden">
              {borrowRecords.map((borrow, index) => {
                const book = booksById.get(borrow.bookId);
                const title = book?.title || borrow.bookTitle || "Borrowed book";
                const image = book?.image || borrow.bookImage;

                return (
                  <article
                    key={`mobile-${borrow.bookId}-${new Date(borrow.borrowedAt).getTime()}-${index}`}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <Link
                      href={`/books/${encodeURIComponent(borrow.bookId)}`}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        {image ? (
                          <Image
                            src={image}
                            alt={`Cover of ${title}`}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <BookOpenIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-foreground">
                          {title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {book?.author || borrow.bookAuthor || "BookNook member"}
                        </span>
                        <Badge variant="secondary" className="mt-1">
                          {book?.category || borrow.bookCategory || "Borrowed"}
                        </Badge>
                      </span>
                    </Link>

                    <dl className="my-4 grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Borrow Date
                        </dt>
                        <dd className="mt-1 font-medium">
                          {formatDate(borrow.borrowedAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Return Date
                        </dt>
                        <dd className="mt-1 font-medium">
                          {formatDate(borrow.dueAt)}
                        </dd>
                      </div>
                    </dl>

                    <ReturnBookButton bookId={borrow.bookId} />
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-border bg-card sm:block">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Book
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Borrow Date
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Return Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {borrowRecords.map((borrow, index) => {
                  const book = booksById.get(borrow.bookId);
                  const title = book?.title || borrow.bookTitle || "Borrowed book";
                  const image = book?.image || borrow.bookImage;

                  return (
                    <tr
                      key={`${borrow.bookId}-${new Date(borrow.borrowedAt).getTime()}-${index}`}
                      className="align-middle"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/books/${encodeURIComponent(borrow.bookId)}`}
                          className="flex min-w-52 items-center gap-3"
                        >
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                            {image ? (
                              <Image
                                src={image}
                                alt={`Cover of ${title}`}
                                fill
                                sizes="48px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <BookOpenIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-foreground">
                              {title}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {book?.author || borrow.bookAuthor || "BookNook member"}
                            </span>
                            <Badge variant="secondary" className="mt-1">
                              {book?.category || borrow.bookCategory || "Borrowed"}
                            </Badge>
                          </span>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(borrow.borrowedAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(borrow.dueAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <ReturnBookButton bookId={borrow.bookId} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default function MyBorrowsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[65svh] items-center justify-center">
          <LoadingSpinner label="Loading your borrowed books..." />
        </div>
      }
    >
      <MyBorrowsContent />
    </Suspense>
  );
}
