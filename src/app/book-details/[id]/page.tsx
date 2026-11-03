import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BookDetailsPage({
  params,
}: PageProps<"/book-details/[id]">) {
  const { id } = await params;

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BookOpenIcon className="size-6" />
          </span>
          <CardTitle className="text-2xl">Book Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5">
          <p className="text-sm text-muted-foreground">
            Book details will be available here once the details API is ready.
          </p>
          <p className="text-xs text-muted-foreground">Book ID: {id}</p>
          <Button nativeButton={false} render={<Link href="/all-books" />}>
            Back to All Books
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
