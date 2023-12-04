import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/api";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImg: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

const addUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorRepostId || post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);
    const repostAuthor = users.find((user) => user.id === post.authorRepostId);

    if (!author)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });

    return {
      post,
      author: {
        ...author,
        username: author.username,
      },
      repostAuthor: { ...repostAuthor },
    };
  });
};

export { filterUserForClient, addUserDataToPosts };
