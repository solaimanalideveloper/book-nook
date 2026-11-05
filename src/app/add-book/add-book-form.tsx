"use client";

import * as React from "react";
import { BookOpenIcon, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { type Book, CATEGORIES, formatDate, saveBook } from "@/lib/books";
import { authClient } from "@/lib/auth-client";

const initialForm = {
  title: "",
  author: "",
  category: "Fiction",
  description: "",
  totalCopies: "1",
};

export function AddBookForm() {
  const router = useRouter();
  const [form, setForm] = React.useState(initialForm);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const imageFileRef = React.useRef<HTMLInputElement>(null);

  const [addDate, setAddDate] = React.useState<Date>(new Date());
  const [dateOpen, setDateOpen] = React.useState(false);
  const today = React.useMemo(() => new Date(), []);

  React.useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.name || !user.email) {
      toast.error("Please log in before adding a book.");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a book cover image to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadForm = new FormData();
      uploadForm.append("image", imageFile);
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: uploadForm,
      });
      let uploadResult: unknown;
      try {
        uploadResult = await uploadResponse.json();
      } catch {
        throw new Error(
          `Image upload service returned invalid JSON (HTTP ${uploadResponse.status}).`,
        );
      }

      const uploadError =
        typeof uploadResult === "object" &&
        uploadResult !== null &&
        "error" in uploadResult &&
        typeof uploadResult.error === "string"
          ? uploadResult.error
          : null;
      const imageUrl =
        typeof uploadResult === "object" &&
        uploadResult !== null &&
        "imageUrl" in uploadResult &&
        typeof uploadResult.imageUrl === "string"
          ? uploadResult.imageUrl
          : null;

      if (!uploadResponse.ok || !imageUrl) {
        throw new Error(uploadError || "Could not upload the cover image.");
      }

      const book: Book = {
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        image: imageUrl,
        description: form.description.trim(),
        totalCopies: Math.max(1, Number(form.totalCopies) || 1),
        availableCopies: Math.max(1, Number(form.totalCopies) || 1),
        addedBy: user.name,
        addedByEmail: user.email,
        createdAt: addDate.toISOString(),
      };

      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          `Books service returned invalid JSON (HTTP ${response.status}).`,
        );
      }

      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : `The Books API responded with status ${response.status}.`;
        throw new Error(message);
      }

      saveBook(book);
      toast.success("Book added successfully.");
      router.replace("/#latest-books");

      setForm(initialForm);
      setImageFile(null);
      setImagePreview("");
      if (imageFileRef.current) imageFileRef.current.value = "";
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(`Could not add the book: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldLabel = "mb-2 block";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
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
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
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
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
          />
        </div>

        <div>
          <Label className={fieldLabel} htmlFor="category-trigger">
            Category
          </Label>
          <Select
            value={form.category}
            onValueChange={(value) => update("category", value ?? "Fiction")}
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
            value={form.totalCopies}
            onChange={(e) => update("totalCopies", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <Label className={fieldLabel}>Add Date</Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                />
              }
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                {formatDate(addDate)}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={addDate}
                onSelect={(date) => {
                  if (date) {
                    setAddDate(date);
                    setDateOpen(false);
                  }
                }}
                disabled={{ after: today }}
                defaultMonth={addDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="image-file" className={fieldLabel}>
            Book Cover Image
          </Label>
          <Input
            ref={imageFileRef}
            id="image-file"
            type="file"
            accept="image/*"
            required
            className="w-full min-w-0 text-xs sm:text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageFile(file ?? null);
              setImagePreview(file ? URL.createObjectURL(file) : "");
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Selected cover will be uploaded to imgbb when you submit.
          </p>
        </div>

        {imagePreview && (
          <div className="sm:col-span-2">
            <p className={fieldLabel}>Image Preview</p>
            <div className="relative h-48 w-32 overflow-hidden rounded-md border border-border">
              <Image
                src={imagePreview}
                alt="Selected book cover preview"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}

        <div className="sm:col-span-2">
          <Label htmlFor="description" className={fieldLabel}>
            Short Description
          </Label>
          <Textarea
            id="description"
            required
            rows={4}
            placeholder="e.g. An exploration of Japanese philosophy, life purpose, healthy habits, happiness..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="name" className={fieldLabel}>
            User Name
          </Label>
          <Input id="name" required value={user?.name ?? ""} readOnly />
        </div>

        <div>
          <Label htmlFor="email" className={fieldLabel}>
            User Email
          </Label>
          <Input
            id="email"
            required
            type="email"
            value={user?.email ?? ""}
            readOnly
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="justify-center sm:col-span-2"
          disabled={isSubmitting}
        >
          <BookOpenIcon className="size-4" />
          {isSubmitting ? "Adding Book..." : "Add Book"}
        </Button>
      </form>
    </div>
  );
}
