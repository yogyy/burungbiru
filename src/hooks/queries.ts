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
  return api.profile.getCurrentUser.useQuery({});
}

function updateViews({ id }: { id: string }) {
  return api.post.updateViewPost.useQuery(
    { id },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
}

function getDetailPost({ id }: { id: string }) {
  return api.post.detailPost.useQuery(
    { id },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
}

export {
  getUserbyUsername,
  getUserFollower,
  getCurrentUser,
  getDetailPost,
  updateViews,
};
