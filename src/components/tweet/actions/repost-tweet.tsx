import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { TweetProps, VariantTweet } from "../types";
import { RetweetIcon } from "~/components/icons/twitter-icons";
import { authClient } from "~/lib/auth-client";
import NumberFlow from "@number-flow/react";
import { numberFlowFormat } from ".";

interface RepostProps {
  post: TweetProps;
  variant: VariantTweet;
}

export const RepostTweet = ({ variant, post }: RepostProps) => {
  const postId = post.type === "REPOST" ? post.parentId! : post.id;
  const utils = api.useUtils();
  const { data } = authClient.useSession();
  const { data: repost, isLoading } = api.post.reposts.useQuery({ postId });

  const { mutate: addRepost, isLoading: loadingRepost } = api.action.retweetPost.useMutation({
    onSuccess() {
      utils.post.reposts.invalidate({ postId });
    },
  });
  const { mutate: deleteRepost, isLoading: loadingUnrepost } = api.action.unretweetPost.useMutation(
    {
      onSuccess() {
        utils.post.reposts.invalidate({ postId });
        utils.feed.userPosts.invalidate({ userId: data?.user.id });
      },
    }
  );

  function retweetPost() {
    if (repost?.is_reposted) {
      deleteRepost({ postId });
    } else {
      addRepost({ postId });
    }
  }

  return (
    <div className="flex w-full flex-1 text-accent" aria-label="repost post">
      <div className="group flex items-center" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={retweetPost}
          disabled={loadingRepost || loadingUnrepost || isLoading}
          className={cn(
            "group/button z-10 -mr-2 flex overflow-hidden border-2 transition-[border-color]",
            "hover:bg-[#00BA7C]/10 focus-visible:border-[#00BA7C]/50 focus-visible:bg-[#00BA7C]/10 group-hover:bg-[#00BA7C]/10"
          )}
        >
          <RetweetIcon
            className={cn(
              variant === "details" ? "h-5 w-5" : "h-[18px] w-[18px]",
              "fill-accent transition-colors duration-300 group-hover:fill-[#00BA7C] group-focus-visible/button:fill-[#00BA7C]",
              repost?.is_reposted && "fill-[#00BA7C]"
            )}
          />
          <span className="sr-only">repost post</span>
        </Button>
        {repost?.total_reposts! > 0 ? (
          <span
            className={cn(
              "flex-1 overflow-hidden pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
              "font-normal transition-colors duration-300 group-hover:text-[#00BA7C] group-focus:text-[#00BA7C]",
              repost?.is_reposted && "text-[#00BA7C]"
            )}
          >
            <NumberFlow value={repost?.total_reposts} format={numberFlowFormat} />
          </span>
        ) : null}
      </div>
    </div>
  );
};
