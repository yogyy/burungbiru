import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  ignoredRoutes: [
    "/favicon.ico",
    "/fonts/chirp-medium-web.woff",
    "/fonts/chirp-bold-web.woff",
    "/fonts/chirp-regular-web.woff",
  ],
});

export const config = {
  matcher: ["/((?!_next/image|_next/static|favicon.ico).*)", "/"],
};
