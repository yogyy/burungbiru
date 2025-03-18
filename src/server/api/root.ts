import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";
import { profileRouter } from "./routers/profile";
import { actionRouter } from "./routers/action";
import { feedsRouter } from "./routers/feeds";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  feed: feedsRouter,
  post: postRouter,
  profile: profileRouter,
  action: actionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
