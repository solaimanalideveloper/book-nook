"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, MenuIcon, UserRoundIcon, XIcon } from "lucide-react";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuth } from "@/components/auth/auth-context";
import { LoginDialog, type AuthMode } from "@/components/auth/login-dialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/** Pages only members can see after login */
const PUBLIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
];

const MEMBER_LINKS = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<AuthMode>("login");
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    // rAF instead of a synchronous call so the effect never sets state directly
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) => pathname === href;

  // Transparent only when floating over the home hero image.
  // Everywhere else the navbar uses theme tokens (works in light & dark).
  const transparent = pathname === "/" && !scrolled && !menuOpen;

  // Guests see Home + All Books; logged-in users also get the member links
  const links = user ? [...PUBLIC_LINKS, ...MEMBER_LINKS] : PUBLIC_LINKS;

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

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
        {/* Logo + brand name */}
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

        {/* Center links (desktop) */}
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

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle transparent={transparent} />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className={cn(
                      "flex items-center gap-2 rounded-full py-1 pr-3 pl-1 transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                      transparent
                        ? "border border-white/20 bg-white/10 hover:bg-white/20"
                        : "border border-border bg-muted hover:bg-accent"
                    )}
                  />
                }
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "hidden max-w-[120px] truncate text-sm font-medium sm:block",
                    transparent ? "text-[#f3ebdd]" : "text-foreground"
                  )}
                >
                  {user.name}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profile" />}>
                  <UserRoundIcon />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={logout}>
                  <LogOutIcon />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                onClick={() => openAuth("login")}
                className="rounded-full"
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => openAuth("register")}
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

          {/* Mobile hamburger */}
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

      {/* Mobile menu */}
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

      <LoginDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </header>
  );
}
