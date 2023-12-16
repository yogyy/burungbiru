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
    },
  });
  const unfollow = api.action.unfollowUser.useMutation({
    onSuccess: () => {
      ctx.profile.userFollower.invalidate({ userId: user.id });
    },
  });
  const { user: currentUser } = useUser();

  return !follower?.followers.some(
    (follower) => follower.followingId === currentUser?.id
  ) ? (
    <Button
      variant="outline"
      type="button"
      className={cn(
        "sticky border-2 border-transparent bg-white text-card hover:bg-white/80 focus-visible:border-primary",
        className
      )}
      onClick={(e) => {
        following.mutate({ userId: user.id });
        e.stopPropagation();
      }}
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
      //   disabled
      onClick={(e) => {
        unfollow.mutate({ userId: user.id });
        e.stopPropagation();
      }}
    >
      {isHover ? "Unfollow" : "Following"}
    </Button>
  );
};
