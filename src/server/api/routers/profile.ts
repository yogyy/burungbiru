import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  addUserDataToPosts,
  filterUserForClient,
} from "~/server/helper/dbHelper";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }
      return filterUserForClient(user);
    }),

  getUserRandomUser: publicProcedure.input(z.object({})).query(async () => {
    const users = (
      await clerkClient.users.getUserList({
        orderBy: "-created_at",
        limit: 3,
      })
    ).map(filterUserForClient);

    return users;
  }),

  userPosts: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ ctx, input: { limit = 10, cursor, userId } }) => {
      const posts = await ctx.prisma.post
        .findMany({
          take: limit + 1,
          cursor: cursor ? { createdAt_id: cursor } : undefined,
          where: {
            OR: [
              { type: "POST", authorId: userId },
              { type: "REPOST", authorRepostId: userId },
            ],
          },
          include: { repost: true },
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPosts);

      let nextCursor: typeof cursor | undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        if (nextItem != null) {
          nextCursor = {
            id: nextItem?.post.id,
            createdAt: nextItem?.post?.createdAt,
          };
        }
      }

      return {
        posts,
        nextCursor,
      };
    }),

  userPostwithMedia: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const media = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
          NOT: { image: "" },
          type: { not: "REPOST" },
        },
        orderBy: [{ createdAt: "desc" }],
      });
      return addUserDataToPosts(media);
    }),

  userLikedPosts: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.like
        .findMany({
          where: { userId: input.userId },
          orderBy: [{ createdAt: "asc" }],
          include: {
            post: true,
          },
        })
        .then((liked) => liked.map((like) => like.post))
        .then(addUserDataToPosts);
    }),

  userBookmarkedPosts: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const bookmark = await ctx.prisma.post.findMany({
        where: {
          bookmarks: { some: { userId: input.userId } },
        },
        orderBy: [{ createdAt: "desc" }],
      });
      return addUserDataToPosts(bookmark);
    }),

  userWithReplies: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reply
        .findMany({
          where: {
            userId: input.userId,
          },
          include: { post: true },
        })
        .then((replies) => replies.map((reply) => reply.post))
        .then(addUserDataToPosts);
    }),

  userActions: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const likes = await ctx.prisma.like.findMany({
        where: { userId: input.userId },
      });
      const bookmarks = await ctx.prisma.bookmark.findMany({
        where: { userId: input.userId },
      });
      const repost = await ctx.prisma.repost.findMany({
        where: { userId: input.userId },
      });
      if (!likes || !bookmarks) throw new TRPCError({ code: "NOT_FOUND" });

      return { repost, likes, bookmarks };
    }),
});
