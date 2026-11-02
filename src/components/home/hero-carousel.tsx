"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "cn";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SLIDES = [
  { src: "/image/image1.png", alt: "Curved bookshelves in a warm library" },
  { src: "/image/image2.png", alt: "Library corridor with tall arches" },
  { src: "/image/image3.png", alt: "Grand library with winding shelves" },
  { src: "/image/image4.png", alt: "Wall of books from floor to ceiling" },
];

const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Track the selected slide (fires for clicks, drags and autoplay)
  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Auto-scroll every 5s. Reset the timer whenever the slide changes,
  // so manual navigation doesn't get skipped mid-cycle.
  React.useEffect(() => {
    if (!api || paused || SLIDES.length < 2) return;
    const timer = setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [api, paused, index]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured library photos"
      className="relative h-screen min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="h-full [&_[data-slot='carousel-content']]:h-full"
      >
        <CarouselContent className="h-full -ml-0">
          {SLIDES.map((slide, i) => (
            <CarouselItem key={slide.src} className="relative h-full pl-0">
              <div
                className={cn(
                  "absolute inset-0",
                  i === index && "animate-kenburns"
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
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dark overlay so text stays readable over every photo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

      {/* Text overlay — same container as the navbar so the headline,
          logo and icon all share one aligned column */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-24 sm:px-6 lg:pb-28">
          <Badge
            variant="outline"
            className="pointer-events-none mb-5 h-7 w-fit rounded-full border-white/30 bg-white/10 px-4 text-[11px] font-semibold tracking-[0.3em] text-[#e0b352] uppercase backdrop-blur-sm"
          >
            booknook
          </Badge>
          <h1 className="max-w-3xl text-4xl leading-[1.1] font-bold text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Knowledge is above all else.
            <br />
            Let&rsquo;s read books.
          </h1>

          <div className="pointer-events-auto mt-10 flex items-center justify-between">
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
                  aria-selected={i === index}
                  role="tab"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "h-2.5 w-8 rounded-full p-0 outline-none focus-visible:ring-white/60 hover:bg-white/40",
                    i === index ? "bg-[#8ab98d]" : "bg-white/40"
                  )}
                />
              ))}
            </div>

            {/* Prev / next controls */}
            <div className="flex gap-2">
              <Button
                size="icon"
                aria-label="Previous slide"
                onClick={() => api?.scrollPrev()}
                className="size-11 rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
              >
                <ChevronLeftIcon className="size-5" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                size="icon"
                aria-label="Next slide"
                onClick={() => api?.scrollNext()}
                className="size-11 rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
              >
                <ChevronRightIcon className="size-5" />
                <span className="sr-only">Next slide</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
