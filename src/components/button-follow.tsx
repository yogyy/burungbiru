import React from "react";
import { useHover } from "usehooks-ts";
import { api } from "~/utils/api";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "~/lib/utils";

interface FollowButtonProps extends ButtonProps {
  userId: string;
}
export const FollowButton = (props: FollowButtonProps) => {
  const { userId, className, ...rest } = props;
  const hoverRef = React.useRef(null);
  const isHover = useHover(hoverRef);
  const utils = api.useUtils();

  const { data: user, isLoading } = api.profile.userIsFollowed.useQuery({ userId });
  const following = api.action.followUser.useMutation({
    onSuccess: () => {
      utils.profile.userFollow.invalidate({ userId });
      utils.profile.userIsFollowed.invalidate({ userId });
    },
  });
  const unfollow = api.action.unfollowUser.useMutation({
    onSuccess: () => {
      utils.profile.userFollow.invalidate({ userId });
      utils.profile.userIsFollowed.invalidate({ userId });
    },
  });

  function FollowAction(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    if (user?.is_followed) {
      unfollow.mutate({ userId });
    } else {
      following.mutate({ userId });
    }
  }

  if (isLoading) return null;

  return (
    <Button
      ref={hoverRef}
      variant="ghost"
      type="button"
      className={cn(
        user?.is_followed
          ? "min-w-[101.05px] border border-border text-white hover:border-[rgb(244,33,46)] hover:bg-[rgb(244,33,46)]/[.15] hover:text-[rgb(244,33,46)] focus-visible:border-white focus-visible:bg-white/10 focus-visible:outline-offset-0 focus-visible:outline-white"
          : "border-none bg-white text-card hover:bg-white/80 focus-visible:outline-offset-1 focus-visible:outline-primary",
        className
      )}
      disabled={following.isLoading || unfollow.isLoading}
      onClick={FollowAction}
      {...rest}
    >
      {user?.is_followed ? (isHover ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
};
