import { api } from "~/utils/api";

function getUserFollower({ userId }: { userId: string }) {
  return api.profile.userFollower.useQuery(
    { userId: userId },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
}

export { getUserFollower };
