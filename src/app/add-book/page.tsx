import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AddBookPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-foreground">
      <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
        <PlusIcon className="size-6" />
      </span>
      <h1 className="text-3xl font-bold">Add Book</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Share a book with your neighbourhood — coming soon.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/" />}
        className="rounded-full"
      >
        Back to Home
      </Button>
    </div>
  );
}
