import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  ArrowLeftRightIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    title: "Find a book",
    description: "Browse the shelves and open any book you like.",
    icon: SearchIcon,
  },
  {
    title: "Borrow it",
    description: "Confirm the borrow. The book is yours for 7 days.",
    icon: ArrowLeftRightIcon,
  },
  {
    title: "Return it",
    description: "Done reading? Return it from My Borrows in one click.",
    icon: Undo2Icon,
  },
];

export function HowBorrowingWorks() {
  return (
    <section className="bg-muted/40 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Section heading */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            How Borrowing Works
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Three steps. No library card needed.
          </p>
        </div>

        {/* Step cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((step, index) => (
            <Card
              key={step.title}
              className="text-center hover:ring-brand-accent/35"
            >
              <CardContent className="flex flex-col items-center gap-3 pt-7 pb-8 px-6">
                <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </span>
                <p
                  className="text-[11px] font-bold tracking-[0.18em] text-brand-accent uppercase"
                  aria-label={`Step ${index + 1}`}
                >
                  Step {index + 1}
                </p>
                <h3 className="text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Button
            nativeButton={false}
            render={<Link href="/books" />}
            size="lg"
            className="rounded-full"
          >
            <Image
              src="/image/book-icon.png"
              alt=""
              width={18}
              height={18}
              className="size-[18px] invert dark:invert-0"
            />
            Browse All Books
          </Button>
        </div>
      </div>
    </section>
  );
}
