import { useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { TweetProps } from "../tweet-post";
import { CommentIcon, LikeIcon, RetweetIcon } from "~/components/icons";

export const RepostTweet: React.FC<
  Omit<TweetProps, "author" | "repostAuthor">
> = ({ variant, className, post, ...props }) => {
  const ctx = api.useUtils();
  const { mutateAsync: repost } = api.action.retweetPost.useMutation({
    onMutate() {},
    onSuccess() {
      ctx.action.postActions.invalidate({ postId: post.id });
      ctx.post.timeline.invalidate();
      ctx.profile.userPosts.invalidate();
    },
  });
  const { mutateAsync: deleteRepost } = api.action.unretweetPost.useMutation({
    onMutate() {},
    onSuccess() {
      ctx.action.postActions.invalidate({ postId: post.id });
      ctx.post.timeline.invalidate();
    },
  });

  const postId = post.type === "REPOST" ? post.repostId ?? "" : post.id;
  const { data } = api.action.postActions.useQuery(
    {
      postId,
    },
    { refetchOnWindowFocus: false }
  );
  const postRepost = data?.repost;
  const { user: currentUser } = useUser();
  function retweetPost() {
    if (!postRepost?.some((repost) => repost.userId === currentUser?.id)) {
      repost({ postId });
    } else {
      deleteRepost({ postId });
    }
  }

  return (
    <div className="flex w-full flex-1 text-accent" {...props}>
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={retweetPost}
          className={cn(
            "group/button z-10 -mr-2 flex border-2 transition-all ease-in last:mr-0",
            "hover:bg-[#00BA7C]/10 focus-visible:border-[#00BA7C]/50 focus-visible:bg-[#00BA7C]/10 group-hover:bg-[#00BA7C]/10"
          )}
        >
          <RetweetIcon
            className={cn(
              "h-5 w-5",
              variant === "details" && "h-6 w-6",
              "fill-accent transition duration-300 group-hover:fill-[#00BA7C] group-focus-visible/button:fill-[#00BA7C]",
              postRepost?.some((like) => like.userId === currentUser?.id) &&
                "fill-[#00BA7C]"
            )}
          />
          <span className="sr-only">repost</span>
        </Button>
        <span
          className={cn(
            "h-fit pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
            "font-normal transition duration-300 group-hover:text-[#00BA7C] group-focus:text-[#00BA7C]",
            postRepost?.some((like) => like.userId === currentUser?.id) &&
              "text-[#00BA7C]"
          )}
        >
          {postRepost && postRepost?.length >= 1 && postRepost?.length}
        </span>
      </div>
    </div>
  );
};
