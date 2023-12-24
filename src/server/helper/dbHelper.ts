import { clerkClient } from "@clerk/nextjs";
// import type { User } from "@clerk/nextjs/api";
import type { Post, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "../db";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImg: user.imageUrl,
    firstName: user.name,
    lastName: "",
  };
};

const addUserDataToPosts = async (posts: Post[]) => {
  // const users = (
  //   await clerkClient.users.getUserList({
  //     userId: posts.map((post) => post.authorId || post.authorRepostId!),
  //     limit: 100,
  //   })
  // ).map(filterUserForClient);

  const userDB = await prisma.user
    .findMany({
      where: {
        id: { in: posts.map((post) => post.authorId || post.authorRepostId!) },
      },
    })
    .then((item) => item.map(filterUserForClient));

  return posts.map((post) => {
    const author = userDB.find((user) => user.id === post.authorId);
    const repostAuthor = userDB.find((user) => user.id === post.authorRepostId);

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

export { filterUserForClient, addUserDataToPosts };
