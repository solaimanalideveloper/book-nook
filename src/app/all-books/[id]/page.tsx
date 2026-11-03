import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpenIcon } from "lucide-react";

import { BorrowButton } from "@/app/all-books/[id]/borrow-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/books";

type BookDetails = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image?: string;
  description: string;
  totalCopies: number | string;
  availableCopies?: number | string;
  addedBy?: string;
  addedByEmail?: string;
  createdAt?: string;
};

function getCopies(value: number | string | undefined, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function BookDetailsPage({
  params,
}: PageProps<"/all-books/[id]">) {
  const { id } = await params;
  const response = await fetch(
    `http://localhost:8000/all-books/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  if (response.status === 404) notFound();
  if (!response.ok) {
    throw new Error(`Could not load book details (HTTP ${response.status}).`);
  }

  const book = (await response.json()) as BookDetails | null;
  if (!book) notFound();
// comment

  const totalCopies = getCopies(book.totalCopies);
  const availableCopies = getCopies(book.availableCopies, totalCopies);

  return (
    <section className="mx-auto grid min-h-[75vh] max-w-7xl grid-cols-1 items-start gap-6 px-4 py-24 sm:gap-8 sm:px-6 sm:py-28 lg:grid-cols-[minmax(280px,420px)_1fr] lg:gap-10">
      <div className="relative mx-auto aspect-2/3 w-full max-w-sm overflow-hidden rounded-xl border border-border bg-muted shadow-lg lg:mx-0">
        {book.image ? (
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            priority
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <BookOpenIcon className="size-12" />
            <span>No cover image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <Badge variant="secondary">{book.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {book.title}
          </h1>
          <p className="text-lg text-muted-foreground">by {book.author}</p>
        </div>

        <p className="leading-7 text-muted-foreground">{book.description}</p>

        <Card className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Added by</p>
            <p className="mt-1 font-medium">
              {book.addedBy || "BookNook member"}
            </p>
            {book.addedByEmail && (
              <a
                href={`mailto:${book.addedByEmail}`}
                className="mt-1 block break-all text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {book.addedByEmail}
              </a>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Copies left</p>
            <p className="mt-1 font-medium">
              {availableCopies} of {totalCopies}
            </p>
          </div>
          {book.createdAt && (
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Added on</p>
              <p className="mt-1 font-medium">{formatDate(book.createdAt)}</p>
            </div>
          )}
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <BorrowButton bookId={book._id} availableCopies={availableCopies} />
          <Button
            nativeButton={false}
            render={<Link href="/all-books" />}
            variant="ghost"
          >
            Back to all books
          </Button>
        </div>
      </div>
    </section>
  );
}
