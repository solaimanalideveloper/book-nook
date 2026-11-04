import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes: Record<string, string> = {
  "/add-book": "/register?callbackURL=%2Fadd-book",
  "/my-books": "/login?callbackURL=%2Fmy-books",
  "/my-borrows": "/login?callbackURL=%2Fmy-borrows",
  "/profile": "/login?callbackURL=%2Fprofile",
};

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isBookDetailsPage =
    pathname.startsWith("/all-books/") && pathname.split("/").length === 3;
  const redirectTo =
    protectedRoutes[pathname] ||
    (isBookDetailsPage
      ? `/register?callbackURL=${encodeURIComponent(`${pathname}${search}`)}`
      : undefined);

  if (redirectTo && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book",
    "/my-books",
    "/my-borrows",
    "/profile",
    "/all-books/:id",
  ],
};
