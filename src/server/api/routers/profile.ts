import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addUserDataToPosts } from "~/server/helper/dbHelper";
import { updateUserSchema } from "~/components/form/form";

export const profileRouter = createTRPCRouter({
  updateUserInfo: privateProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          name: input.name,
          bio: input.bio,
          location: input.location,
          website: input.website,
        },
      });
    }),

  getCurrentUser: publicProcedure
    .input(z.object({ follow: z.boolean().optional().default(false) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: { followers: input.follow, following: input.follow },
      });
    }),

  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return user;
    }),

  getUserByUsernameMutate: privateProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: { username: input.username },
      });
    }),

  getUserRandomUserDB: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findMany({
        take: 3,
        where: { id: { not: { equals: ctx.user.id ?? "" } } },
        orderBy: { createdAt: "desc" },
        include: { followers: true, following: true },
      });
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
              { type: "REPOST", authorParentId: userId },
            ],
          },
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
          orderBy: [{ createdAt: "desc" }],
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
      const replies = await ctx.prisma.post.findMany({
        where: { authorId: input.userId, AND: { type: "COMMENT" } },
      });
      return addUserDataToPosts(replies);
    }),

  userFollower: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: { followers: true, following: true },
      });
    }),
});
