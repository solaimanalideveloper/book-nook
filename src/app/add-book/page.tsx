"use client";

import * as React from "react";
import { BookOpenIcon, CheckCircle2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
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

import { useAuth } from "@/components/auth/auth-context";
import {
  type Book,
  CATEGORIES,
  getBooksSnapshot,
  getBooksServerSnapshot,
  saveBook,
  subscribeToBooks,
} from "@/lib/books";

export default function AddBookPage() {
  const { user } = useAuth();
  // Auto-refreshes whenever a book is saved (useSyncExternalStore)
  const books = React.useSyncExternalStore(
    subscribeToBooks,
    getBooksSnapshot,
    getBooksServerSnapshot
  );

  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [category, setCategory] = React.useState<string>("Fiction");
  const [totalCopies, setTotalCopies] = React.useState("1");
  const [description, setDescription] = React.useState("");

  const [justAdded, setJustAdded] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string>("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Map the form onto the exact BookNook Book data contract
    const book: Book = {
      title: title.trim(),
      author: author.trim(),
      category,
      image: imagePreview, // cover URL (data URL). Placeholder renders when empty.
      description: description.trim(),
      totalCopies: Math.max(1, Number(totalCopies) || 1),
      availableCopies: Math.max(1, Number(totalCopies) || 1),
      addedBy: user?.name ?? "John Doe",
      addedByEmail: user?.email ?? "john@example.com",
      createdAt: new Date(),
    };

    saveBook(book);
    setJustAdded(true);

    // Reset the form for the next book
    setTitle("");
    setAuthor("");
    setCategory("Fiction");
    setTotalCopies("1");
    setDescription("");
    setImagePreview("");
  }

  const fieldLabel = "mb-2 block";

  return (
    <>
      {/* Header band */}
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

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* Submit confirmation */}
        {justAdded && (
          <div
            role="status"
            className="mb-8 flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3"
          >
            <CheckCircle2Icon className="size-5 shrink-0 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Your book was added successfully. Find it in the shelf below.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"
        >
          <div>
            <Label htmlFor="title" className={fieldLabel}>
              Book Title
            </Label>
            <Input
              id="title"
              required
              placeholder="e.g. Ikigai"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="author" className={fieldLabel}>
              Author Name
            </Label>
            <Input
              id="author"
              required
              placeholder="e.g. Hector Garcia and Francesc Miralles"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <Label className={fieldLabel} htmlFor="category-trigger">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "Fiction")}
            >
              <SelectTrigger id="category-trigger" className="w-full">
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="copies" className={fieldLabel}>
              Total Copies
            </Label>
            <Input
              id="copies"
              required
              type="number"
              min={1}
              step={1}
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="image" className={fieldLabel}>
              Book Cover Image
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description" className={fieldLabel}>
              Short Description
            </Label>
            <Textarea
              id="description"
              required
              rows={4}
              placeholder="e.g. An exploration of Japanese philosophy, life purpose, healthy habits, happiness..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="name" className={fieldLabel}>
              User Name
            </Label>
            <Input
              id="name"
              required
              placeholder="e.g. John Doe"
              defaultValue={user?.name ?? ""}
              key={user?.name ?? "guest-name"}
            />
          </div>

          <div>
            <Label htmlFor="email" className={fieldLabel}>
              User Email
            </Label>
            <Input
              id="email"
              required
              type="email"
              placeholder="e.g. john@example.com"
              defaultValue={user?.email ?? ""}
              key={user?.email ?? "guest-email"}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="justify-center sm:col-span-2"
          >
            <BookOpenIcon className="size-4" />
            Add Book
          </Button>
        </form>
      </div>

      {/* Books this user added — one card per saved book */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Your Shelf
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Books added from this browser — newest first.
            </p>
          </div>

          {books.length === 0 ? (
            <div className="mx-auto mt-10 max-w-md rounded-xl border border-border border-dashed bg-background px-6 py-10 text-center">
              <p className="border-none text-sm text-muted-foreground">
                No books added yet. Fill the form above and your shelf will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {books.map((book, i) => (
                <BookCard
                  key={`${book.title}-${book.createdAt}-${i}`}
                  book={book}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
