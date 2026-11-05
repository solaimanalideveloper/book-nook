import Link from "next/link";
import {
  SparklesIcon,
  FlaskConicalIcon,
  LandmarkIcon,
  SmileIcon,
  RocketIcon,
  GhostIcon,
  PaletteIcon,
  HeartIcon,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type Category = {
  name: string;
  description: string;
  icon: LucideIcon;
};

const CATEGORIES: Category[] = [
  {
    name: "Fiction",
    description: "Novels and short stories",
    icon: SparklesIcon,
  },
  {
    name: "Science",
    description: "How the world works",
    icon: FlaskConicalIcon,
  },
  {
    name: "History",
    description: "Stories from the past",
    icon: LandmarkIcon,
  },
  {
    name: "Kids",
    description: "Picture books and more",
    icon: SmileIcon,
  },
  {
    name: "Mystery",
    description: "Thrillers and whodunnits",
    icon: GhostIcon,
  },
  {
    name: "Self-Help",
    description: "Grow a little every day",
    icon: HeartIcon,
  },
  {
    name: "Travel",
    description: "See the world from a page",
    icon: RocketIcon,
  },
  {
    name: "Art",
    description: "Beauty on every page",
    icon: PaletteIcon,
  },
];

export function TopCategories() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Section heading */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Top Categories
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick a shelf and start reading.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href="/books"
              aria-label={`Browse ${category.name} books`}
              className="group"
            >
              <Card className="items-center text-center hover:ring-brand-accent/40">
                <span className="mt-2 grid size-11 place-items-center rounded-full bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <category.icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {category.name}
                </h3>
                <p className="mb-2 text-xs text-muted-foreground">
                  {category.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
