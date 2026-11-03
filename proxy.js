import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";

const protectedRoutes = {
  "/add-book": "/register?callbackURL=%2Fadd-book",
  "/my-books": "/login?callbackURL=%2Fmy-books",
  "/my-borrows": "/login?callbackURL=%2Fmy-borrows",
  "/profile": "/login?callbackURL=%2Fprofile",
};

export function proxy(request) {
  const redirectTo = protectedRoutes[request.nextUrl.pathname];

  if (redirectTo && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-book", "/my-books", "/my-borrows", "/profile"],
};
