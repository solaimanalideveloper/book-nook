"use client";

import * as React from "react";
import Image from "next/image";
import {
  BookOpenIcon,
  CheckCircle2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  formatDate,
  saveBook,
} from "@/lib/books";

/** Fallback cover while no image is chosen (simple data-URL placeholder) */
const EMPTY_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='180'><rect width='100%25' height='100%25' fill='%23e4dcc7'/><text x='50%25' y='52%25' text-anchor='middle' font-size='13' fill='%236b6353'>BookNook</text></svg>";

export default function AddBookPage() {  const { user } = useAuth();

  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [category, setCategory] = React.useState<string>("Fiction");
  const [totalCopies, setTotalCopies] = React.useState("1");
  const [description, setDescription] = React.useState("");

  const [addedBook, setAddedBook] = React.useState<Book | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [imagePending, setImagePending] = React.useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return setImagePreview("");
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Map form → the exact Book data contract used across BookNook
    const book: Book = {
      title: title.trim(),
      author: author.trim(),
      category,
      image: imagePreview, // data URL; falls back to a placeholder at render time
      description: description.trim(),
      totalCopies: Math.max(1, Number(totalCopies) || 1),
      availableCopies: Math.max(1, Number(totalCopies) || 1),
      addedBy: user?.name ?? "Guest",
      addedByEmail: user?.email ?? "guest@booknook.com",
      createdAt: new Date(),
    };

    setImagePending(true);
    try {
      saveBook(book);
      setAddedBook(book);
      setTitle("");
      setAuthor("");
      setCategory("Fiction");
      setTotalCopies("1");
      setDescription("");
      setImagePreview("");
    } finally {
      setImagePending(false);
    }
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
              placeholder="e.g. Héctor García"
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
              placeholder="What is this book about?"
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
              placeholder="Your name"
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
              placeholder="you@booknook.com"
              defaultValue={user?.email ?? ""}
              key={user?.email ?? "guest-email"}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={imagePending}
            className="justify-center sm:col-span-2"
          >
            <BookOpenIcon className="size-4" />
            Add Book
          </Button>
        </form>

        {/* Success feedback */}
        {addedBook && (
          <Card className="mt-10 border-primary/40 bg-background">
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <div className="relative mx-auto aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-lg bg-muted sm:mx-0">
                {addedBook.image ? (
                  <Image
                    src={addedBook.image}
                    alt={addedBook.title}
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={EMPTY_IMAGE}
                    alt={addedBook.title}
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2Icon className="size-4" />
                  Book added successfully!
                </p>
                <h2 className="mt-2 truncate text-lg font-bold text-foreground">
                  {addedBook.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {addedBook.author} · {formatDate(addedBook.createdAt)}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-3 mb-3 font-medium"
                >
                  {addedBook.category}
                </Badge>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {addedBook.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {addedBook.availableCopies} of {addedBook.totalCopies} copies
                  available · Added by {addedBook.addedBy}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
