import type { User } from "@clerk/nextjs/dist/api";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username:
      user.username !== null ? user.username : user.firstName + user.lastName!,
    profileImg: user.profileImageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
