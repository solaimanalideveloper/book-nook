"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { BookOpenIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/books";

export type MyBook = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image?: string;
  description?: string;
  totalCopies: number | string;
  availableCopies?: number | string;
  addedByEmail: string;
};

type EditValues = {
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies: string;
};

function getCopies(value: number | string | undefined, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getErrorMessage(result: unknown): string | null {
  if (
    typeof result === "object" &&
    result !== null &&
    "error" in result &&
    typeof result.error === "string"
  ) {
    return result.error;
  }
  return null;
}

function BookRow({
  book,
}: {
  book: MyBook;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [values, setValues] = React.useState<EditValues>({
    title: book.title,
    author: book.author,
    category: book.category,
    description: book.description ?? "",
    totalCopies: String(book.totalCopies),
  });

  function resetValues() {
    setValues({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description ?? "",
      totalCopies: String(book.totalCopies),
    });
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/my-books/${encodeURIComponent(book._id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            totalCopies: Number(values.totalCopies),
          }),
        },
      );
      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result) || "Could not update the book.",
        );
      }

      if (
        typeof result !== "object" ||
        result === null ||
        !("book" in result) ||
        typeof result.book !== "object" ||
        result.book === null
      ) {
        throw new Error("The server returned an invalid book response.");
      }

      toast.success("Book updated.");
      router.replace(`/all-books/${encodeURIComponent(book._id)}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/my-books/${encodeURIComponent(book._id)}`, {
        method: "DELETE",
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result) || "Could not delete the book.",
        );
      }

      toast.success("Book deleted.");
      router.replace("/all-books");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  const totalCopies = getCopies(book.totalCopies);
  const availableCopies = getCopies(book.availableCopies, totalCopies);

  return (
    <tr className="bg-card">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            {book.image ? (
              <Image
                src={book.image}
                alt={`Cover of ${book.title}`}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <BookOpenIcon
                aria-hidden="true"
                className="absolute inset-0 m-auto size-5 text-muted-foreground"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{book.title}</p>
            <p className="truncate text-xs text-muted-foreground">{book.author}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="secondary">{book.category}</Badge>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {availableCopies} / {totalCopies}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <Dialog
            open={isEditing}
            onOpenChange={(open) => {
              if (!open && isSaving) return;
              if (!open) resetValues();
              setIsEditing(open);
            }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                resetValues();
                setIsEditing(true);
              }}
              disabled={isDeleting}
            >
              <PencilIcon />
              Edit
            </Button>
            <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit book details</DialogTitle>
                <DialogDescription>
                  Update the information for “{book.title}”.
                </DialogDescription>
              </DialogHeader>
              <form
                id={`edit-book-${book._id}`}
                onSubmit={handleSave}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="grid gap-2">
                  <Label htmlFor={`title-${book._id}`}>Book title</Label>
                  <Input
                    id={`title-${book._id}`}
                    required
                    value={values.title}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`author-${book._id}`}>Author</Label>
                  <Input
                    id={`author-${book._id}`}
                    required
                    value={values.author}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        author: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`category-${book._id}`}>Category</Label>
                  <Select
                    value={values.category}
                    onValueChange={(category) =>
                      setValues((current) => ({
                        ...current,
                        category: category ?? "",
                      }))
                    }
                  >
                    <SelectTrigger id={`category-${book._id}`} className="w-full">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`copies-${book._id}`}>Total copies</Label>
                  <Input
                    id={`copies-${book._id}`}
                    type="number"
                    min={1}
                    step={1}
                    required
                    value={values.totalCopies}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        totalCopies: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor={`description-${book._id}`}>Description</Label>
                  <Textarea
                    id={`description-${book._id}`}
                    required
                    rows={3}
                    value={values.description}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </div>
              </form>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetValues();
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form={`edit-book-${book._id}`}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              if (!isDeleting) setIsDeleteDialogOpen(open);
            }}
          >
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              <Trash2Icon />
              Delete
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2Icon className="text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete this book?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete “{book.title}” from your
                  books? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void handleDelete()}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete book"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}

export function MyBooksTable({ initialBooks }: { initialBooks: MyBook[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Book
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Category
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Copies
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {initialBooks.map((book) => (
            <BookRow key={book._id} book={book} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
