import { HeroCarousel } from "@/components/home/hero-carousel";
import { HowBorrowingWorks } from "@/components/home/how-borrowing-works";
import { TopCategories } from "@/components/home/top-categories";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <HowBorrowingWorks />
      <TopCategories />
    </>
  );
}
