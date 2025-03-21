import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { BookmarkIcon, BookmarkIconFill } from "~/components/icons/twitter-icons";
import { toast } from "sonner";
import { TweetProps, VariantTweet } from "../types";
import { useRouter } from "next/router";
import NumberFlow from "@number-flow/react";
import { numberFlowFormat } from ".";

interface BookmarkProps {
  post: TweetProps;
  variant: VariantTweet;
}

export const BookmarkTweet = ({ variant, post }: BookmarkProps) => {
  const postId = post.type === "REPOST" ? post.parentId! : post.id;
  const { data, isLoading } = api.post.bookmarks.useQuery({ postId });
  const utils = api.useUtils();
  const { pathname } = useRouter();

  const { mutate: addToBookmark, isLoading: loadingMutate } = api.action.bookmarkPost.useMutation({
    onSuccess() {
      utils.post.bookmarks.invalidate({ postId });
      toast.success("Added to your Bookmarks", { id: `${post.id}-addbookmark` });
    },
  });
  const { mutate: deleteBookmark, isLoading: loadingUnmutate } =
    api.action.unbookmarkPost.useMutation({
      onSuccess() {
        utils.post.bookmarks.invalidate({ postId });
        if (pathname === "/i/bookmarks") utils.feed.userBookmarks.invalidate();
        toast.success("Removed from your Bookmarks", { id: `${post.id}-removebookmark` });
      },
    });

  function bookmarkAction() {
    if (data?.is_bookmarked) {
      deleteBookmark({ postId });
    } else {
      addToBookmark({ postId });
    }
  }
  return (
    <div
      className={cn(
        "flex w-full flex-1 text-accent",
        variant !== "details" && "w-fit flex-none justify-end"
      )}
      aria-label="bookmark post"
    >
      <div className="group flex items-center" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          onClick={bookmarkAction}
          type="button"
          size="icon"
          disabled={loadingMutate || loadingUnmutate || isLoading}
          className={cn(
            "group/button z-10 flex border-2 transition-[border-color] xs:-mr-2",
            "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10"
          )}
        >
          {data?.is_bookmarked ? (
            <BookmarkIconFill
              className={cn(
                "transition-transform duration-300",
                variant === "details" ? "h-5 w-5" : "h-[18px] w-[18px]",
                data?.is_bookmarked && "fill-primary"
              )}
            />
          ) : (
            <BookmarkIcon
              className={cn(
                "fill-accent transition-colors duration-300",
                variant === "details" ? "h-5 w-5" : "h-[18px] w-[18px]",
                "group-hover:fill-primary group-focus-visible/button:fill-primary",
                data?.is_bookmarked && "fill-primary"
              )}
            />
          )}
          <span className="sr-only">bookmark post</span>
        </Button>
        {data?.total_bookmarks! > 0 ? (
          <span
            className={cn(
              "h-fit overflow-hidden pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
              "font-normal transition-colors duration-300 group-hover:text-primary group-focus:text-primary",
              variant === "default" ? "hidden" : "block"
            )}
          >
            {variant === "details" && (
              <NumberFlow value={data?.total_bookmarks} format={numberFlowFormat} />
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
};
