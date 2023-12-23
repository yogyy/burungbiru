import { api } from "~/utils/api";

function getUserFollower({ userId }: { userId: string }) {
  return api.profile.userFollower.useQuery(
    { userId: userId },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
}

function getUserbyUsername({ username }: { username: string }) {
  return api.profile.getUserByUsernameDB.useQuery(
    { username },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
}

function getCurrentUser() {
  return api.profile.getCurrentUser.useQuery();
}

export { getUserFollower, getUserbyUsername, getCurrentUser };
