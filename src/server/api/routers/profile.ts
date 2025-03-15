import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { updateUserSchema } from "~/components/form/form";

export const profileRouter = createTRPCRouter({
  updateUserInfo: privateProcedure.input(updateUserSchema).mutation(async ({ ctx, input }) => {
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

  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.user?.id },
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

  getUserRandomUser: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      take: 3,
      where: { id: { not: { equals: ctx.user?.id ?? "" } } },
      orderBy: { createdAt: "desc" },
      include: { followers: true, following: true },
    });
  }),

  userMediaCount: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.count({
        where: {
          authorId: input.userId,
          type: { notIn: ["REPOST"] },
          image: { not: "" },
        },
      });
    }),

  userLikesCount: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.like.count({ where: { userId: input.userId } });
    }),

  userFollow: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const follower = await ctx.prisma.follow.count({
        where: { followerId: input.userId },
      });
      const following = await ctx.prisma.follow.count({
        where: { followingId: input.userId },
      });

      return { total_following: following, total_follower: follower };
    }),

  userIsFollowed: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followedByUser = await ctx.prisma.follow.findUnique({
        where: { followerId_followingId: { followingId: ctx.userId, followerId: input.userId } },
        select: { id: true },
      });

      return { is_followed: Boolean(followedByUser?.id) };
    }),
});
