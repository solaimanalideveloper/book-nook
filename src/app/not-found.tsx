import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[65svh] flex-col items-center justify-center px-4 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <BookOpenIcon className="size-8" />
      </span>
      <p className="mt-6 text-sm font-semibold tracking-widest text-brand-accent uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
        This page is off the shelf
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We could not find the page you were looking for. Head back to the
        BookNook home page and choose another book.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/" />}
        className="mt-7"
      >
        Back to Home
      </Button>
    </section>
  );
}
