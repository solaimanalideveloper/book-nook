import Image from "next/image";
import { BookMarkedIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type Book, formatDate } from "@/lib/books";

/** Placeholder cover while a book has no image (tiny inline data-URL) */
const PLACEHOLDER_COVER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='180'><rect width='100%25' height='100%25' fill='%23e4dcc7'/><text x='50%25' y='52%25' text-anchor='middle' font-size='13' fill='%236b6353'>BookNook</text></svg>";

/**
 * Displays one book following the BookNook Book data contract:
 * title, author, category, image, description,
 * totalCopies, availableCopies, addedBy, addedByEmail, createdAt.
 */
export function BookCard({ book }: { book: Book }) {
  return (
    <Card className="gap-3 bg-background pt-0">
      {/* Cover */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-muted">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(min-width: 1280px) 260px, (min-width: 640px) 30vw, 45vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <Image
            src={PLACEHOLDER_COVER}
            alt={book.title}
            fill
            sizes="(min-width: 1280px) 260px, (min-width: 640px) 30vw, 45vw"
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <CardContent className="flex min-w-0 flex-1 flex-col gap-2 px-4">
        <Badge variant="secondary" className="w-fit font-medium">
          {book.category}
        </Badge>
        <h3 className="truncate text-base font-bold text-foreground">
          {book.title}
        </h3>
        <p className="truncate text-sm text-muted-foreground">{book.author}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {book.description}
        </p>

        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <BookMarkedIcon className="size-3.5 shrink-0" />
            {book.availableCopies} of {book.totalCopies} copies available
          </p>
          <p className="truncate">
            Added by{" "}
            <span className="font-medium text-foreground">
              {book.addedBy}
            </span>{" "}
            ({book.addedByEmail}) on {formatDate(book.createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
