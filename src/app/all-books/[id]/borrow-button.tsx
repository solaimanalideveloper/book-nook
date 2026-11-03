"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function BorrowButton({
  bookId,
  availableCopies,
}: {
  bookId: string;
  availableCopies: number;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isBorrowing, setIsBorrowing] = React.useState(false);

  async function borrowBook() {
    if (!session) {
      router.push(
        `/login?callbackURL=${encodeURIComponent(`/all-books/${bookId}`)}`,
      );
      return;
    }

    setIsBorrowing(true);
    try {
      const response = await fetch(`/api/books/${encodeURIComponent(bookId)}/borrow`, {
        method: "POST",
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Could not borrow this book.");
      }

      toast.success(result.message || "Book borrowed successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(message);
    } finally {
      setIsBorrowing(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={borrowBook}
      disabled={isPending || isBorrowing || availableCopies < 1}
    >
      {isPending
        ? "Checking..."
        : isBorrowing
          ? "Borrowing..."
          : availableCopies < 1
            ? "Unavailable"
            : "Borrow This Book"}
    </Button>
  );
}
