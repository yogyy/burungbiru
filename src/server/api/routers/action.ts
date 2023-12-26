import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { tweetSchema } from "~/utils/validation";

export const actionRouter = createTRPCRouter({
  likePost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.like.create({
        data: {
          userId: ctx.userId,
          postId: input.postId,
        },
      });
    }),

  unlikePost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.like.deleteMany({
        where: { postId: input.postId, userId: ctx.userId },
      });
    }),

  reposts: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const repost = await ctx.prisma.repost.findMany({
        where: { postId: input.postId },
      });
      if (!repost) throw new TRPCError({ code: "NOT_FOUND" });

      return repost;
    }),

  likes: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const likes = await ctx.prisma.like.findMany({
        where: { postId: input.postId },
      });
      if (!likes) throw new TRPCError({ code: "NOT_FOUND" });

      return likes;
    }),

  replies: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const replies = await ctx.prisma.reply.findMany({
        where: {
          parentId: input.postId,
        },
      });
      if (!replies) throw new TRPCError({ code: "NOT_FOUND" });

      return replies;
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
      const authorId = ctx.userId;
      await ctx.prisma.repost.create({
        data: { userId: authorId, postId: input.postId },
      });
      const sourcePost = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (sourcePost) {
        return await ctx.prisma.post.create({
          data: {
            authorId: sourcePost.authorId,
            content: sourcePost.content,
            image: sourcePost.image,
            imageId: sourcePost.imageId,
            parentId: sourcePost.id,
            type: "REPOST",
            authorParentId: authorId,
          },
        });
      }
    }),

  unretweetPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.deleteMany({
        where: {
          parentId: input.postId,
          authorParentId: ctx.userId,
          AND: { type: "REPOST" },
        },
      });
      return await ctx.prisma.repost.deleteMany({
        where: { postId: input.postId, userId: ctx.userId },
      });
    }),

  replyPost: privateProcedure
    .input(
      tweetSchema.extend({ postId: z.string(), authorParentId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
          image: input.image?.secure_url,
          imageId: input.image?.public_id,
          type: input.type,
          parentId: input.postId,
          authorParentId: input.authorParentId,
        },
      });

      await ctx.prisma.reply.create({
        data: {
          userId: ctx.userId,
          postId: post.id,
          parentId: input.postId,
        },
      });

      return post;
    }),

  followUser: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.follow.create({
        data: { followingId: ctx.userId, followerId: input.userId },
      });
    }),

  unfollowUser: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.follow.deleteMany({
        where: { followingId: ctx.userId, followerId: input.userId },
      });
    }),

  findAllUser: privateProcedure
    .input(z.object({ users: z.string().array() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: { id: { in: input.users } },
      });
    }),
});
