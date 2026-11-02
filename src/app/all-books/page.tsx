import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AllBooksPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-foreground">
      <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
        <BookOpenIcon className="size-6" />
      </span>
      <h1 className="text-3xl font-bold">All Books</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Browse the full collection — coming soon.
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
