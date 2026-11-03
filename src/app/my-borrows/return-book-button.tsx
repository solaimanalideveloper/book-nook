"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

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

export function ReturnBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [isReturning, setIsReturning] = React.useState(false);

  async function returnBook() {
    setIsReturning(true);
    try {
      const response = await fetch(
        `/api/books/${encodeURIComponent(bookId)}/return`,
        { method: "POST" },
      );
      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result) || "Could not return this book.",
        );
      }

      toast.success("Book returned successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(message);
    } finally {
      setIsReturning(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="mt-1 w-full"
      onClick={() => void returnBook()}
      disabled={isReturning}
    >
      {isReturning ? "Returning..." : "Return book"}
    </Button>
  );
}
