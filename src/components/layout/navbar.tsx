"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";

import { cn } from "cn";

import { Button } from "@/components/ui/button";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getStoredUser } from "@/lib/user-session";

/** Pages only members can see after login */
const PUBLIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Profile", href: "/profile" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState(() => getStoredUser());

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    const syncUser = () => setUser(getStoredUser());
    syncUser();
    window.addEventListener("storage", syncUser);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const isActive = (href: string) => pathname === href;
  const transparent = pathname === "/" && !scrolled && !menuOpen;

  const links = PUBLIC_LINKS.filter((link) =>
    user ? true : link.href !== "/profile",
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-border bg-background/95 shadow-lg backdrop-blur-md"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary">
            <Image
              src="/image/book-icon.png"
              alt="BookNook"
              width={22}
              height={22}
              className="size-[22px] invert"
              priority
            />
          </span>
          <span
            className={cn(
              "text-lg font-bold tracking-wide",
              transparent ? "text-white" : "text-foreground"
            )}
          >
            BookNook
          </span>
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  transparent
                    ? isActive(link.href)
                      ? "bg-white/15 font-semibold text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    : isActive(link.href)
                      ? "bg-accent font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle transparent={transparent} />

          {user ? (
            <Button
              nativeButton={false}
              render={<Link href="/profile" />}
              className={cn(
                "rounded-full",
                transparent && "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              )}
            >
              {user.name.split(" ")[0]}
            </Button>
          ) : (
            <>
              <Button
                nativeButton={false}
                render={<Link href="/login" />}
                className="rounded-full"
              >
                Login
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                variant="outline"
                className={cn(
                  "rounded-full",
                  transparent &&
                    "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                )}
              >
                Register
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              transparent
                ? "text-white hover:bg-white/10 hover:text-white"
                : "text-foreground hover:bg-muted"
            )}
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-border bg-background/95 px-4 pt-2 pb-4 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(link.href)
                      ? "bg-accent font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
