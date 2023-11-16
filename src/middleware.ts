import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/api/trpc/posts.getAll",
    "/api/trpc/profile.getUserRandomUser",
    "/api/trpc/profile.getUserRandomUser,posts.getAll",
    "/api/trpc/posts.getAll,profile.getUserRandomUser",
  ],
  ignoredRoutes: [
    "/android-chrome-192x192.png",
    "/favicon-32x32.png",
    "/fonts/chirp-medium-web.woff",
    "/fonts/chirp-bold-web.woff",
    "/fonts/chirp-regular-web.woff",
  ],
});

export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
