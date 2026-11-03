import { Suspense } from "react";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { HowBorrowingWorks } from "@/components/home/how-borrowing-works";
import { LatestBooks } from "@/components/home/latest-books";
import { TopCategories } from "@/components/home/top-categories";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Suspense
        fallback={
          <div className="py-20 text-center text-muted-foreground">
            Loading the latest books...
          </div>
        }
      >
        <LatestBooks />
      </Suspense>
      <HowBorrowingWorks />
      <TopCategories />
    </>
  );
}
