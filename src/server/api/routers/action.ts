import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { tweetSchema } from "~/utils/validation";
import { ratelimit } from "~/server/helper/ratelimit";
import { generateRandId } from "~/lib/utils";
import { env } from "~/env.mjs";

export const actionRouter = createTRPCRouter({
  likePost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.like.create({
        data: { userId: ctx.userId, postId: input.postId },
      });
    }),

  unLikePost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.like.deleteMany({
        where: { postId: input.postId, userId: ctx.userId },
      });
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

      return await ctx.prisma.post.create({
        data: {
          id: generateRandId(),
          authorId,
          parentId: input.postId,
          type: "REPOST",
        },
      });
    }),

  unretweetPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const reposted = await ctx.prisma.repost.delete({
        where: { userId_postId: { userId: ctx.userId, postId: input.postId } },
        include: { post: { include: { children: { where: { authorId: ctx.userId } } } } },
      });

      await ctx.prisma.post.delete({ where: { id: reposted.post.children[0]?.id } });

      return { success: true };
    }),

  replyPost: privateProcedure
    .input(tweetSchema.extend({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.userId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too Many Request",
        });

      const post = await ctx.prisma.post.create({
        data: {
          id: generateRandId(),
          authorId: ctx.userId,
          content: input.content,
          image: input.image?.secure_url,
          imageId: input.image?.public_id,
          type: input.type,
          parentId: input.postId,
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
