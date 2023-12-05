import { useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { TweetProps } from "../tweet-post";
import { LikeIcon, LikeIconFill } from "~/components/icons";

export const LikeTweet: React.FC<
  Omit<TweetProps, "author" | "repostAuthor">
> = ({ variant, className, post }) => {
  const [likeBtn, setLikeBtn] = React.useState(false);
  const ctx = api.useUtils();
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;

  const { mutate: like } = api.action.likePost.useMutation({
    onMutate() {
      setLikeBtn((prev) => !prev);
    },
    onSuccess() {
      setLikeBtn((prev) => !prev);
      ctx.action.likes.invalidate({ postId });
    },
  });
  const { mutate: unlike } = api.action.unlikePost.useMutation({
    onMutate() {
      setLikeBtn((prev) => !prev);
    },
    onSuccess() {
      setLikeBtn((prev) => !prev);
      ctx.action.likes
        .invalidate({ postId })
        .then(() => ctx.profile.userLikedPosts.invalidate());
    },
  });
  const { user: currentUser } = useUser();

  const { data: postLike } = api.action.likes.useQuery(
    {
      postId,
    },
    { refetchOnWindowFocus: false }
  );

  function LikePost() {
    if (!postLike?.some((like) => like.userId === currentUser?.id)) {
      like({ postId });
    } else {
      unlike({ postId });
    }
  }

  return (
    <div className={cn("flex w-full flex-1 text-accent", className)}>
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          disabled={likeBtn}
          onClick={LikePost}
          type="button"
          size="icon"
          className={cn(
            "group/button z-10 -mr-2 flex border-2 transition-all ease-in last:mr-0",
            "hover:bg-[#F91880]/10 focus-visible:border-[#F91880]/50 focus-visible:bg-[#F91880]/10 group-hover:bg-[#F91880]/10"
          )}
        >
          {postLike?.some((like) => like.userId === currentUser?.id) ? (
            <LikeIconFill
              className={cn(
                "transition-transform duration-300",
                variant === "details" ? "h-6 w-6" : "h-5 w-5",
                postLike?.some((like) => like.userId === currentUser?.id) &&
                  "fill-[#F91880]"
              )}
            />
          ) : (
            <LikeIcon
              className={cn(
                "h-5 w-5 fill-accent transition duration-300 group-hover:fill-[#F91880] group-focus-visible/button:fill-[#F91880]",
                variant === "details" && "h-6 w-6",
                postLike?.some((like) => like.userId === currentUser?.id) &&
                  "fill-[#F91880]"
              )}
            />
          )}
          <span className="sr-only">like</span>
        </Button>
        <span
          className={cn(
            "h-fit pl-0.5 font-sans text-[13px] font-normal leading-4 transition duration-300 xs:px-2 md:cursor-pointer",
            "group-hover:text-[#F91880] group-focus:text-[#F91880]",
            postLike?.some((like) => like.userId === currentUser?.id) &&
              "text-[#F91880]"
          )}
        >
          {postLike && postLike?.length >= 1 && postLike?.length}
        </span>
      </div>
    </div>
  );
};
