import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/api/trpc/posts.getAll",
    "/api/trpc/profile.getUserRandomUser",
  ],
  ignoredRoutes: ["/android-chrome-192x192.png", "/favicon-32x32.png"],
});

export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
