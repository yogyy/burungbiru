import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const actionRouter = createTRPCRouter({
  likePost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const like = await ctx.prisma.like.create({
        data: {
          userId: ctx.userId,
          postId: input.postId,
        },
      });
      return like;
    }),

  unlikePost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleteLike = await ctx.prisma.like.deleteMany({
        where: { postId: input.postId, userId: ctx.userId },
      });
      return deleteLike;
    }),

  postActions: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const likes = await ctx.prisma.like.findMany({
        where: { postId: input.postId },
      });
      const bookmarks = await ctx.prisma.bookmark.findMany({
        where: { postId: input.postId },
      });
      const repost = await ctx.prisma.repost.findMany({
        where: { postId: input.postId },
      });
      if (!likes || !bookmarks) throw new TRPCError({ code: "NOT_FOUND" });

      return { repost, likes, bookmarks };
    }),

  bookmarkPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.prisma.bookmark.create({
        data: {
          userId: ctx.userId,
          postId: input.postId,
        },
      });
      return bookmark;
    }),

  unbookmarkPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleteBookmark = await ctx.prisma.bookmark.deleteMany({
        where: { postId: input.postId, userId: ctx.userId },
      });
      return deleteBookmark;
    }),

  retweetPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.repost.create({
        data: { userId: ctx.userId, postId: input.postId },
      });
      const sourcePost = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      return await ctx.prisma.post.create({
        data: {
          authorId: ctx.userId,
          content: sourcePost?.content!,
          image: sourcePost?.image,
          imageId: sourcePost?.imageId,
        },
      });
    }),

  unretweetPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.repost.deleteMany({
        where: { postId: input.postId, userId: ctx.userId },
      });
    }),
});
