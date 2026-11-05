import { Suspense } from "react";
import type { Metadata } from "next";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { HowBorrowingWorks } from "@/components/home/how-borrowing-works";
import { LatestBooks } from "@/components/home/latest-books";
import { TopCategories } from "@/components/home/top-categories";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: {
    absolute: "BookNook | Home",
  },
};

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Suspense
        fallback={
          <div className="py-20">
            <LoadingSpinner label="Loading the latest books..." />
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
