import React from "react";
import { useUser } from "@clerk/nextjs";
import { useHover } from "usehooks-ts";
import { api, RouterOutputs } from "~/utils/api";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "~/lib/utils";

interface FollowButtonProps extends ButtonProps {
  user: RouterOutputs["profile"]["getUserByUsernameDB"];
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  user,
  className,
}) => {
  const hoverRef = React.useRef(null);
  const isHover = useHover(hoverRef);
  const ctx = api.useUtils();

  const { data: follower } = api.profile.userFollower.useQuery({
    userId: user.id,
  });
  const following = api.action.followUser.useMutation({
    onSuccess: () => {
      ctx.profile.userFollower.invalidate({ userId: user.id });
      ctx.profile.getUserRandomUserDB.invalidate();
    },
  });
  const unfollow = api.action.unfollowUser.useMutation({
    onSuccess: () => {
      ctx.profile.userFollower.invalidate({ userId: user.id });
      ctx.profile.getUserRandomUserDB.invalidate();
    },
  });
  const { user: currentUser } = useUser();

  const userInFollowing = !follower?.followers.some(
    (foll) => foll.followingId === currentUser?.id
  );

  function FollowAction(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    if (userInFollowing) {
      following.mutate({ userId: user.id });
    } else {
      unfollow.mutate({ userId: user.id });
    }
  }

  return userInFollowing ? (
    <Button
      ref={hoverRef}
      variant="outline"
      type="button"
      className={cn(
        "border border-transparent bg-white text-card hover:bg-white/80 focus-visible:border-primary",
        className
      )}
      disabled={unfollow.isLoading}
      onClick={FollowAction}
    >
      Follow
    </Button>
  ) : (
    <Button
      ref={hoverRef}
      variant="ghost"
      type="button"
      className={cn(
        "border border-border text-white hover:border-[rgb(244,33,46)] hover:bg-[rgb(244,33,46)]/[.15] hover:text-[rgb(244,33,46)] focus-visible:border-white",
        className
      )}
      disabled={following.isLoading}
      onClick={FollowAction}
    >
      {isHover ? "Unfollow" : "Following"}
    </Button>
  );
};
