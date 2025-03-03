import React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { LikeIcon, LikeIconFill } from "~/components/icons";
import { TweetProps } from "../types";
import { authClient } from "~/lib/auth-client";

interface LikeTweetProps extends Omit<TweetProps, "author" | "repostAuthor"> {}
export const LikeTweet = ({ variant, post }: LikeTweetProps) => {
  const ctx = api.useUtils();
  const { data } = authClient.useSession();
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;

  const { mutate: like, isLoading: loadingLike } =
    api.action.likePost.useMutation({
      onMutate() {
        ctx.action.likes.invalidate({ postId });
      },
      onSuccess() {
        ctx.action.likes.invalidate({ postId });
      },
    });
  const { mutate: unlike, isLoading: loadingUnlike } =
    api.action.unlikePost.useMutation({
      onMutate() {
        ctx.action.likes.invalidate({ postId });
      },
      onSuccess() {
        ctx.action.likes
          .invalidate({ postId })
          .then(() => ctx.profile.userLikedPosts.invalidate());
      },
    });

  const { data: postLike } = api.action.likes.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );

  function LikePost() {
    if (!postLike?.some((like) => like.userId === data?.user.id)) {
      like({ postId });
    } else {
      unlike({ postId });
    }
  }

  return (
    <div className="flex w-full flex-1 text-accent" aria-label="like post">
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          disabled={loadingLike || loadingUnlike}
          onClick={LikePost}
          type="button"
          size="icon"
          className={cn(
            "group/button z-10 -mr-2 flex border-2 transition-all ease-in last:mr-0",
            "hover:bg-[#F91880]/10 focus-visible:border-[#F91880]/50 focus-visible:bg-[#F91880]/10 group-hover:bg-[#F91880]/10"
          )}
        >
          {postLike?.some((like) => like.userId === data?.user.id) ? (
            <LikeIconFill
              className={cn(
                "transition-transform duration-300",
                variant === "details" ? "h-6 w-6" : "h-5 w-5",
                postLike?.some((like) => like.userId === data?.user.id) &&
                  "fill-[#F91880]"
              )}
            />
          ) : (
            <LikeIcon
              className={cn(
                "h-5 w-5 fill-accent transition duration-300 group-hover:fill-[#F91880] group-focus-visible/button:fill-[#F91880]",
                variant === "details" && "h-6 w-6",
                postLike?.some((like) => like.userId === data?.user.id) &&
                  "fill-[#F91880]"
              )}
            />
          )}
          <span className="sr-only">like post</span>
        </Button>
        <span
          className={cn(
            "h-fit pl-0.5 font-sans text-[13px] font-normal leading-4 transition duration-300 xs:px-2 md:cursor-pointer",
            "group-hover:text-[#F91880] group-focus:text-[#F91880]",
            postLike?.some((like) => like.userId === data?.user.id) &&
              "text-[#F91880]"
          )}
        >
          {postLike && postLike?.length >= 1 && postLike?.length}
        </span>
      </div>
    </div>
  );
};
