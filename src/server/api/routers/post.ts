import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { addUserDataToPosts } from "~/server/helper/dbHelper";
import { tweetSchema } from "~/utils/validation";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postRouter = createTRPCRouter({
  detailPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          view: {
            increment: 1,
          },
        },
      });
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: { replies: true },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToPosts([post]))[0];
    }),

  deletePost: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.delete({
        where: { id: input.id },
      });

      if (post) {
        await ctx.prisma.repost.deleteMany({
          where: { postId: post.repostId ?? input.id, userId: ctx.userId },
        });
        await ctx.prisma.post.deleteMany({
          where: {
            repostId: input.id,
            authorId: ctx.userId,
            AND: { type: "REPOST" },
          },
        });
      } else {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return post;
    }),

  timeline: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: { repost: true },
    });
    return addUserDataToPosts(posts);
  }),

  createPost: privateProcedure
    .input(tweetSchema)
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      // const { success } = await ratelimit.limit(authorId);
      // if (!success)
      //   throw new TRPCError({
      //     code: "TOO_MANY_REQUESTS",
      //     message: "Too Many Request",
      //   });

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
          image: input.image?.secure_url,
          imageId: input.image?.public_id,
          type: input.type,
        },
      });
      return post;
    }),

  postReplies: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reply
        .findMany({
          where: {
            parentId: input.postId,
          },
          include: {
            post: true,
          },
          orderBy: [{ createdAt: "asc" }],
        })
        .then((replise) => replise.map((reply) => reply.post))
        .then(addUserDataToPosts);
    }),
});
