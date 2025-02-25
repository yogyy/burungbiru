import React from "react";
import { useUser } from "@clerk/nextjs";
import { useHover } from "usehooks-ts";
import { api, RouterOutputs } from "~/utils/api";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "~/lib/utils";
import { getUserFollower } from "~/hooks/queries";

interface FollowButtonProps extends ButtonProps {
  user: RouterOutputs["profile"]["getUserByUsernameDB"];
}
export const FollowButton = (props: FollowButtonProps) => {
  const { user, className, ...rest } = props;
  const { user: currentUser } = useUser();
  const hoverRef = React.useRef(null);
  const isHover = useHover(hoverRef);
  const ctx = api.useUtils();

  const follower = getUserFollower({ userId: user.id });
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

  const userInFollowing = !follower.data?.followers.some(
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

  if (follower.isLoading) return null;

  return userInFollowing ? (
    <Button
      ref={hoverRef}
      type="button"
      className={cn(
        "border-none bg-white text-card hover:bg-white/80 focus-visible:outline-offset-1 focus-visible:outline-primary",
        className
      )}
      disabled={unfollow.isLoading || follower.isLoading}
      onClick={FollowAction}
      {...rest}
    >
      Follow
    </Button>
  ) : (
    <Button
      ref={hoverRef}
      variant="ghost"
      type="button"
      className={cn(
        "min-w-[101.05px] border border-border text-white",
        "hover:border-[rgb(244,33,46)] hover:bg-[rgb(244,33,46)]/[.15] hover:text-[rgb(244,33,46)]",
        "focus-visible:border-white focus-visible:bg-white/10 focus-visible:outline-offset-0 focus-visible:outline-white",
        className
      )}
      disabled={following.isLoading || follower.isLoading}
      onClick={FollowAction}
      {...rest}
    >
      {isHover ? "Unfollow" : "Following"}
    </Button>
  );
};
