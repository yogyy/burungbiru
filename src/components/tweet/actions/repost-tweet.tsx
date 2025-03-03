import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { TweetProps } from "../types";
import { RetweetIcon } from "~/components/icons";
import { authClient } from "~/lib/auth-client";

interface RepostTweetProps
  extends Omit<TweetProps, "author" | "repostAuthor"> {}
export const RepostTweet = ({ variant, post }: RepostTweetProps) => {
  const ctx = api.useUtils();
  const { data } = authClient.useSession();
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;
  const { mutate: repost, isLoading: loadingRepost } =
    api.action.retweetPost.useMutation({
      onSuccess() {
        ctx.action.reposts.invalidate({ postId });
        ctx.profile.userPosts.invalidate();
      },
    });
  const { mutate: deleteRepost, isLoading: loadingUnrepost } =
    api.action.unretweetPost.useMutation({
      onSuccess() {
        ctx.action.reposts.invalidate({ postId });
        ctx.post.timeline.invalidate();
      },
    });

  const { data: postRepost } = api.action.reposts.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );
  function retweetPost() {
    if (!postRepost?.some((repost) => repost.userId === data?.user.id)) {
      repost({ postId });
    } else {
      deleteRepost({ postId });
    }
  }

  return (
    <div className="flex w-full flex-1 text-accent" aria-label="repost post">
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={retweetPost}
          disabled={loadingRepost || loadingUnrepost}
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
              postRepost?.some((like) => like.userId === data?.user.id) &&
                "fill-[#00BA7C]"
            )}
          />
          <span className="sr-only">repost post</span>
        </Button>
        <span
          className={cn(
            "h-fit pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
            "font-normal transition duration-300 group-hover:text-[#00BA7C] group-focus:text-[#00BA7C]",
            postRepost?.some((like) => like.userId === data?.user.id) &&
              "text-[#00BA7C]"
          )}
        >
          {postRepost && postRepost?.length >= 1 && postRepost?.length}
        </span>
      </div>
    </div>
  );
};
