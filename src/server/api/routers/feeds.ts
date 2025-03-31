import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

const paginationSchema = z.object({
  limit: z.number().optional(),
  cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
});

export const commentsPaginationSchema = z.object({
  limit: z.number().optional(),
  cursor: z.object({ userId: z.string(), postId: z.string() }).optional(),
});

export const feedsRouter = createTRPCRouter({
  home: publicProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input: { limit = 10, cursor } }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { type: "POST" },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
        include: { author: { select: { username: true, image: true, name: true, type: true } } },
      });

      let nextCursor: typeof cursor | undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }
      return { posts, nextCursor };
    }),

  userBookmarks: privateProcedure
    .input(commentsPaginationSchema)
    .query(async ({ ctx, input: { limit = 10, cursor } }) => {
      const bookmarks = await ctx.prisma.bookmark.findMany({
        where: { userId: ctx.userId },
        take: limit + 1,
        cursor: cursor ? { userId_postId: cursor } : undefined,
        select: {
          post: {
            include: {
              author: { select: { username: true, image: true, name: true, type: true } },
            },
          },
        },
        orderBy: [{ createdAt: "desc" }],
      });

      let nextCursor: typeof cursor | undefined;
      if (bookmarks.length > limit) {
        const nextItem = bookmarks.pop();
        if (nextItem != null) {
          nextCursor = { userId: nextItem.post.authorId, postId: nextItem.post.id };
        }
      }

      return { bookmarks: bookmarks.map((item) => item.post), nextCursor };
    }),

  postReplies: publicProcedure
    .input(commentsPaginationSchema.extend({ postId: z.string() }))
    .query(async ({ ctx, input: { postId, limit = 5, cursor } }) => {
      const data = await ctx.prisma.reply.findMany({
        where: { parentId: postId },
        select: {
          post: {
            include: {
              author: { select: { username: true, image: true, name: true, type: true } },
            },
          },
        },
        take: limit + 1,
        cursor: cursor ? { userId_postId: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
      });

      let nextCursor: typeof cursor | undefined;
      if (data && data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { userId: nextItem.post.authorId, postId: nextItem.post.id };
        }
      }
      return { comments: data.map((item) => item.post), nextCursor };
    }),

  userPosts: privateProcedure
    .input(paginationSchema.extend({ userId: z.string() }))
    .query(async ({ ctx, input: { limit = 5, cursor, userId } }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { authorId: userId, type: { not: "COMMENT" } },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
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
        orderBy: [{ createdAt: "desc" }],
      });

      let nextCursor: typeof cursor | undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return { posts, nextCursor };
    }),

  userReplies: privateProcedure
    .input(paginationSchema.extend({ userId: z.string() }))
    .query(async ({ ctx, input: { userId, limit = 5, cursor } }) => {
      const comments = await ctx.prisma.post.findMany({
        where: { authorId: userId, type: "COMMENT" },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
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

      let nextCursor: typeof cursor | undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return { comments, nextCursor };
    }),

  userPostsWithMedia: privateProcedure
    .input(paginationSchema.extend({ userId: z.string() }))
    .query(async ({ ctx, input: { userId, limit = 5, cursor } }) => {
      const media = await ctx.prisma.post.findMany({
        where: {
          authorId: userId,
          type: { not: "REPOST" },
          image: { not: "" },
        },
        orderBy: [{ createdAt: "desc" }],
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        include: {
          author: { select: { username: true, image: true, name: true, type: true } },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (media.length > limit) {
        const nextItem = media.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return { media, nextCursor };
    }),

  userLikes: privateProcedure
    .input(commentsPaginationSchema.extend({ userId: z.string() }))
    .query(async ({ ctx, input: { userId, limit = 5, cursor } }) => {
      const liked = await ctx.prisma.like.findMany({
        where: { userId },
        take: limit + 1,
        cursor: cursor ? { userId_postId: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
        select: {
          post: {
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
          },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (liked.length > limit) {
        const nextItem = liked.pop();
        if (nextItem != null) {
          nextCursor = { userId: nextItem.post.authorId, postId: nextItem.post.id };
        }
      }

      return { likes: liked.map((item) => item.post), nextCursor };
    }),
});
