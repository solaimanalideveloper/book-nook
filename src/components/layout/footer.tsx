import Image from "next/image";
import Link from "next/link";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const CONTACTS = [
  { icon: MailIcon, label: "hello@booknook.com", href: "mailto:hello@booknook.com" },
  { icon: PhoneIcon, label: "+880 1700-000000", href: "tel:+8801700000000" },
  { icon: MapPinIcon, label: "42 Book Street, Dhaka", href: "#" },
];

/** Official brand glyphs — this lucide version ships no social/brand icons */
function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101Z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
    </svg>
  );
}

/** X (Twitter) logo — lucide only ships the old bird, so we use the official X glyph */
function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* Brand block: logo + about line + contact info */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary">
              <Image
                src="/image/book-icon.png"
                alt=""
                width={22}
                height={22}
                className="size-[22px] invert"
              />
            </span>
            <span className="text-lg font-bold tracking-wide">BookNook</span>
          </div>
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">
            Your neighbourhood library, online. Find a book that someone
            nearby already loved, and borrow it for a week.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {CONTACTS.map((contact) => (
              <li key={contact.label}>
                <a
                  href={contact.href}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <contact.icon className="size-4 shrink-0" />
                  <span>{contact.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore links */}
        <div>
          <h2 className="mb-8 text-base font-bold">Explore</h2>
          <ul className="flex flex-col gap-4">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs font-medium tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal links */}
        <div>
          <h2 className="mb-8 text-base font-bold">Legal</h2>
          <ul className="flex flex-col gap-4">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs font-medium tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar: copyright + social icons (official X logo, no bird) */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; 2026 BookNook. All rights reserved.
        </p>
        <div className="flex items-center gap-1.5">
          <Button nativeButton={false} variant="ghost" size="icon" render={<a href="https://facebook.com" target="_blank" rel="noreferrer" />} aria-label="Facebook">
            <FacebookLogo className="size-4" />
          </Button>
          <Button nativeButton={false} variant="ghost" size="icon" render={<a href="https://x.com" target="_blank" rel="noreferrer" />} aria-label="X (Twitter)">
            <XLogo className="size-4" />
          </Button>
          <Button nativeButton={false} variant="ghost" size="icon" render={<a href="https://instagram.com" target="_blank" rel="noreferrer" />} aria-label="Instagram">
            <InstagramLogo className="size-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
