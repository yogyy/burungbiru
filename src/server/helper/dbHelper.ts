import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "../db";

const addUserDataToPosts = async (posts: Post[]) => {
  const userDB = await prisma.user.findMany({
    where: {
      id: { in: posts.map((post) => post.authorId || post.authorParentId!) },
    },
  });

  return posts.map((post) => {
    const author = userDB.find((user) => user.id === post.authorId);
    const repostAuthor = userDB.find((user) => user.id === post.authorParentId);

    if (!author)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });

    return {
      post,
      author: { ...author },
      repostAuthor: { ...repostAuthor },
    };
  });
};

export { addUserDataToPosts };
