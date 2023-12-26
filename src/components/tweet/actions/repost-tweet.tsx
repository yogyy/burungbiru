import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { TweetProps } from "../tweet-post";
import { RetweetIcon } from "~/components/icons";

export const RepostTweet: React.FC<
  Omit<TweetProps, "author" | "repostAuthor">
> = ({ variant, className, post, ...props }) => {
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;
  const ctx = api.useUtils();
  const { mutate: repost } = api.action.retweetPost.useMutation({
    onSuccess() {
      ctx.action.reposts.invalidate({ postId });
      ctx.profile.userPosts.invalidate();
    },
  });
  const { mutate: deleteRepost } = api.action.unretweetPost.useMutation({
    onSuccess() {
      ctx.action.reposts.invalidate({ postId });
      ctx.post.timeline.invalidate();
    },
  });

  const { data: postRepost } = api.action.reposts.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );
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
