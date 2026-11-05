"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
} from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SLIDES = [
  {
    src: "/image/image1.png",
    alt: "Curved bookshelves in a warm library",
    eyebrow: "booknook",
    title: (
      <>
        Knowledge is above all else.
        <br />
        Let&rsquo;s read books.
      </>
    ),
    text: "Borrow from the shelves of your neighbourhood — no library card needed.",
  },
  {
    src: "/image/image2.png",
    alt: "Library corridor with tall arches",
    title: "Your neighbourhood library, online.",
    text: "Find a book that someone nearby already loved, and borrow it for a week.",
  },
  {
    src: "/image/image3.png",
    alt: "Grand library with winding shelves",
    title: "Share the books you love.",
    text: "Add the books from your shelf and lend them to readers in one click.",
  },
  {
    src: "/image/image4.png",
    alt: "Wall of books from floor to ceiling",
    title: "Read together. Grow together.",
    text: "Track borrows, due dates and returns — all in one place.",
  },
];

const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const [swiper, setSwiper] = React.useState<SwiperInstance | null>(null);
  const [index, setIndex] = React.useState(0);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured library photos"
      className="relative h-[100svh] min-h-[560px] overflow-hidden"
      onMouseEnter={() => swiper?.autoplay.stop()}
      onMouseLeave={() => swiper?.autoplay.start()}
    >
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: AUTOPLAY_MS,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setIndex(instance.realIndex)}
        className="h-full w-full"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={slide.src} className="relative h-full">
            {/* Background image with slow zoom */}
            <div
              className={cn(
                "absolute inset-0",
                i === index && "animate-kenburns",
              )}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                draggable={false}
                className="object-cover select-none"
              />
            </div>

            {/* Gradients for readability over every photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

            {/* Per-slide content */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
              <div className="mx-auto w-full max-w-7xl px-4 pb-32 sm:px-6 lg:pb-36">
                {slide.eyebrow ? (
                  <Badge
                    variant="outline"
                    className="mb-5 h-7 rounded-full border-white/30 bg-white/10 px-4 text-[11px] font-semibold tracking-[0.3em] text-brand-accent uppercase backdrop-blur-sm"
                  >
                    {slide.eyebrow}
                  </Badge>
                ) : null}
                <h1
                  className={cn(
                    "max-w-3xl text-4xl leading-[1.1] font-bold text-white sm:text-5xl lg:text-6xl xl:text-7xl",
                  )}
                >
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">
                  {slide.text}
                </p>
                <Button
                  nativeButton={false}
                  render={<Link href="/books" />}
                  className="pointer-events-auto mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/85"
                >
                  <BookOpenIcon className="size-4" />
                  Browse Books
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-6 z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Dots — click to jump to a slide */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Choose slide"
          >
            {SLIDES.map((slide, i) => (
              <Button
                key={slide.src}
                variant="ghost"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => swiper?.slideToLoop(i)}
                className={cn(
                  "h-2.5 w-8 rounded-full p-0 outline-none focus-visible:ring-white/60 hover:bg-white/40",
                  i === index ? "bg-brand-accent" : "bg-white/40"
                )}
              />
            ))}
          </div>

          {/* Prev / next controls */}
          <div className="flex gap-2">
            <Button
              size="icon"
              aria-label="Previous slide"
              onClick={() => swiper?.slidePrev()}
              className="size-11 rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
            >
              <ChevronLeftIcon className="size-5" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              size="icon"
              aria-label="Next slide"
              onClick={() => swiper?.slideNext()}
              className="size-11 rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
            >
              <ChevronRightIcon className="size-5" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
