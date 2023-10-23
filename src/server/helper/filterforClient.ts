import type { User } from "@clerk/nextjs/api";

export const filterUserForClient = (user: User) => {
  if (user.username === null) {
    usernamed: user.firstName;
  }
  return {
    id: user.id,
    username: user.username,
    profileImg: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
