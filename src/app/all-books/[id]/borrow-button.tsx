"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function openBorrowDialog() {
    if (!session) {
      router.push(
        `/login?callbackURL=${encodeURIComponent(`/books/${bookId}`)}`,
      );
      return;
    }

    setDialogOpen(true);
  }

  async function borrowBook() {
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
      setDialogOpen(false);
      router.replace("/my-borrows");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(message);
    } finally {
      setIsBorrowing(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={openBorrowDialog}
        disabled={isPending || isBorrowing || availableCopies < 1}
      >
        {isPending
          ? "Checking..."
          : isBorrowing
            ? "Borrowing..."
            : availableCopies < 1
              ? "Not Available"
              : "Borrow This Book"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm your borrow</DialogTitle>
            <DialogDescription>
              Confirm that you want to borrow this book. Please return it
              within seven days.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="borrower-name">Name</Label>
              <Input
                id="borrower-name"
                value={session?.user.name ?? ""}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="borrower-email">Email</Label>
              <Input
                id="borrower-email"
                type="email"
                value={session?.user.email ?? ""}
                readOnly
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isBorrowing}
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={borrowBook}
              disabled={isBorrowing || !session}
            >
              {isBorrowing ? "Borrowing..." : "Confirm Borrow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
