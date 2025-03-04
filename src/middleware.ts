import { getSessionCookie } from "better-auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/p/@")) {
    return NextResponse.redirect(
      new URL(`${request.nextUrl.pathname.replace("@", "")}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/i/bookmarks", "/p/:path*"],
};
