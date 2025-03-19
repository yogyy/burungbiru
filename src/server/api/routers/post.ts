import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { tweetSchema } from "~/utils/validation";
import { ratelimit } from "~/server/helper/ratelimit";
import { generateRandId } from "~/lib/utils";

export const postRouter = createTRPCRouter({
  detailPost: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: { id: input.id },
      include: {
        author: { select: { username: true, image: true, name: true, type: true } },
        parent: {
          select: {
            id: true,
            image: true,
            imageId: true,
            content: true,
            createdAt: true,
            author: { select: { username: true, image: true, name: true, type: true } },
          },
        },
      },
    });

    if (!post) throw new TRPCError({ code: "NOT_FOUND" });

    return post;
  }),

  detailParentPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const parent = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: {
          author: { select: { username: true, image: true, name: true, type: true } },
        },
      });

      if (!parent) throw new TRPCError({ code: "NOT_FOUND" });

      return parent;
    }),

  createPost: privateProcedure.input(tweetSchema).mutation(async ({ ctx, input }) => {
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
      },
    });
    return post;
  }),

  deletePost: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.delete({
        where: { id: input.id },
      });

      if (post.type === "REPOST") {
        await ctx.prisma.repost.delete({
          where: { userId_postId: { userId: post.authorId, postId: post.parentId! } },
        });
      }

      return post;
    }),

  reposts: privateProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reposts = await ctx.prisma.repost.findMany({
        where: { postId: input.postId },
        select: { id: true },
      });

      const reposted = await ctx.prisma.repost.findUnique({
        where: { userId_postId: { userId: ctx.userId, postId: input.postId } },
        select: { id: true },
      });

      return { is_reposted: Boolean(reposted?.id), total_reposts: reposts.length };
    }),

  likes: privateProcedure.input(z.object({ postId: z.string() })).query(async ({ ctx, input }) => {
    const likes = await ctx.prisma.like.findMany({
      where: { postId: input.postId },
      select: { id: true },
    });

    const liked = await ctx.prisma.like.findUnique({
      where: { userId_postId: { userId: ctx.userId, postId: input.postId } },
      select: { id: true },
    });

    return { is_liked: Boolean(liked?.id), total_likes: likes.length };
  }),

  bookmarks: privateProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const bookmarks = await ctx.prisma.bookmark.findMany({
        where: { postId: input.postId },
        select: { id: true },
      });

      const bookmarked = await ctx.prisma.bookmark.findUnique({
        where: { userId_postId: { userId: ctx.userId, postId: input.postId } },
        select: { id: true },
      });

      return { is_bookmarked: Boolean(bookmarked?.id), total_bookmarks: bookmarks.length };
    }),

  replies: privateProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const replies = await ctx.prisma.reply.findMany({
        where: { parentId: input.postId },
        select: { postId: true },
      });

      return { total_replies: replies.length };
    }),
});
