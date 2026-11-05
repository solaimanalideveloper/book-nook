"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import {
  LogOutIcon,
  MenuIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import { cn } from "cn";

import { Button } from "@/components/ui/button";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { authClient } from "@/lib/auth-client";

/** Pages only members can see after login */
const PUBLIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const links = PUBLIC_LINKS.filter(
    (link) => user || link.href === "/" || link.href === "/books",
  );
  const isActive = (href: string) => pathname === href;
  const transparent = pathname === "/" && !scrolled && !menuOpen;

  async function handleLogout() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || "Could not log out.");
        return;
      }

      toast.success("Logged out successfully.");
      router.replace("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(`Could not log out: ${message}`);
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-border bg-card/95 shadow-md backdrop-blur-md"
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
            <Menu.Root>
              <Menu.Trigger
                className={cn(
                  "flex h-9 max-w-36 items-center gap-2 rounded-full border border-border bg-background/80 px-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  transparent &&
                    "border-white/30 bg-white/10 text-white hover:bg-white/20",
                )}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt=""
                    width={28}
                    height={28}
                    unoptimized
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <UserRoundIcon className="size-4" />
                  </span>
                )}
                <span className="truncate">{user.name.split(" ")[0]}</span>
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={8} align="end" className="z-50">
                  <Menu.Popup className="min-w-52 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Menu.Item
                      render={<Link href="/profile" />}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-muted"
                    >
                      <UserRoundIcon className="size-4" />
                      My Profile
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => void handleLogout()}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive outline-none data-highlighted:bg-destructive/10"
                    >
                      <LogOutIcon className="size-4" />
                      Logout
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          ) : (
            <div className="hidden items-center gap-1.5 lg:flex">
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
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "lg:hidden",
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
        <div className="border-t border-border bg-card/95 px-4 pt-2 pb-4 backdrop-blur-md lg:hidden">
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
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 lg:hidden">
            {!user && (
              <>
                <Button
                  nativeButton={false}
                  render={<Link href="/login" />}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/register" />}
                  variant="outline"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
