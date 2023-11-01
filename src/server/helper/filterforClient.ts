import type { User } from "@clerk/nextjs/api";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImg: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
