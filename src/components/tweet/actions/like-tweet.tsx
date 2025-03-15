import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { LikeIcon, LikeIconFill } from "~/components/icons";
import { TweetProps, VariantTweet } from "../types";
import NumberFlow from "@number-flow/react";
import { numberFlowFormat } from ".";
import { authClient } from "~/lib/auth-client";

interface LikeProps {
  post: TweetProps;
  variant: VariantTweet;
}

export const LikeTweet = ({ variant, post }: LikeProps) => {
  const postId = post.type === "REPOST" ? post.parentId! : post.id;
  const utils = api.useUtils();
  const { data } = authClient.useSession();
  const { data: like, isLoading } = api.post.likes.useQuery({ postId });

  const { mutate: addLikes, isLoading: loadingLike } = api.action.likePost.useMutation({
    onSuccess() {
      utils.post.likes.invalidate({ postId });
    },
  });
  const { mutate: deleteLikes, isLoading: loadingUnlike } = api.action.unLikePost.useMutation({
    onSuccess() {
      utils.post.likes.invalidate({ postId });
      utils.feed.userLikes.invalidate({ userId: data?.user.id });
    },
  });

  function LikePost() {
    if (like?.is_liked) {
      deleteLikes({ postId });
    } else {
      addLikes({ postId });
    }
  }

  return (
    <div className="flex w-full flex-1 text-accent" aria-label="like post">
      <div className="group flex w-full items-center" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          disabled={loadingLike || loadingUnlike || isLoading}
          onClick={LikePost}
          type="button"
          size="icon"
          className={cn(
            "group/button z-10 -mr-2 flex border-2 transition-colors duration-300",
            "hover:bg-[#F91880]/10 focus-visible:border-[#F91880]/50 focus-visible:bg-[#F91880]/10 group-hover:bg-[#F91880]/10"
          )}
        >
          {like?.is_liked ? (
            <LikeIconFill
              className={cn(
                "transition-transform duration-300",
                variant === "details" ? "h-5 w-5" : "h-[18px] w-[18px]",
                like?.is_liked && "text-[#F91880]"
              )}
            />
          ) : (
            <LikeIcon
              className={cn(
                "group-hover:fill-[#F91880] group-focus-visible/button:fill-[#F91880]",
                "fill-accent transition-colors duration-300",
                variant === "details" ? "h-5 w-5" : "h-[18px] w-[18px]"
              )}
            />
          )}
          <span className="sr-only">like post</span>
        </Button>
        {like?.total_likes! > 0 ? (
          <span
            className={cn(
              "h-fit flex-1 overflow-hidden pl-0.5 font-sans text-[13px] font-normal leading-4 transition duration-300 xs:px-2 md:cursor-pointer",
              "group-hover:text-[#F91880] group-focus:text-[#F91880]",
              like?.is_liked && "text-[#F91880]"
            )}
          >
            <NumberFlow value={like?.total_likes} format={numberFlowFormat} />
          </span>
        ) : null}
      </div>
    </div>
  );
};
