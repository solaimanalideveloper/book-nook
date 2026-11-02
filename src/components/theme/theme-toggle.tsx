"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "cn";

import { Button } from "@/components/ui/button";

/**
 * Theme toggle using the bookNook sun/moon icon.
 * `transparent` = navbar is floating over the hero image, so the icon
 * needs to be white (the source icon is black).
 */
export function ThemeToggle({ transparent = false }: { transparent?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={cn(
        transparent
          ? "text-white hover:bg-white/10 hover:text-white"
          : "text-foreground hover:bg-muted"
      )}
    >
      <Image
        src="/image/themes.png"
        alt=""
        width={20}
        height={20}
        className={cn("size-5", transparent ? "invert" : "dark:invert")}
      />
    </Button>
  );
}
