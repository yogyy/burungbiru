import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { BookmarkIcon, BookmarkIconFill } from "~/components/icons";
import { toast } from "react-hot-toast";
import { TweetProps } from "../types";

interface BookmarkProps extends Omit<TweetProps, "author" | "repostAuthor"> {}
export const BookmarkTweet = ({ variant, post }: BookmarkProps) => {
  const ctx = api.useUtils();
  const { user: currentUser } = useUser();
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;
  const { mutate: addToBookmark, isLoading: loadingMutate } =
    api.action.bookmarkPost.useMutation({
      onSuccess() {
        ctx.post.bookmarks.invalidate({ postId });
        ctx.post.bookmarks.invalidate({ postId });
        toast.success("Added to your Bookmarks", {
          id: `${post.id}-addbookmark`,
        });
      },
    });
  const { mutate: deleteBookmark, isLoading: loadingUnmutate } =
    api.action.unbookmarkPost.useMutation({
      onSuccess() {
        ctx.post.bookmarks.invalidate({ postId });
        ctx.profile.userBookmarkedPosts.invalidate().then(() =>
          toast.success("Removed from your Bookmarks", {
            id: `${post.id}-removebookmark`,
          })
        );
      },
    });

  const { data: postBookmark } = api.post.bookmarks.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );

  function bookmarkAction() {
    if (!postBookmark?.some((mark) => mark.userId === currentUser?.id)) {
      addToBookmark({ postId });
    } else {
      deleteBookmark({ postId });
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
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          onClick={bookmarkAction}
          type="button"
          size="icon"
          disabled={loadingMutate || loadingUnmutate}
          className={cn(
            "group/button z-10 flex border-2 transition-all ease-in xs:-mr-2",
            "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10"
          )}
        >
          {postBookmark?.some((mark) => mark.userId === currentUser?.id) ? (
            <BookmarkIconFill
              className={cn(
                "transition-transform duration-300",
                variant === "details" ? "h-6 w-6" : "h-5 w-5",
                postBookmark?.some((mark) => mark.userId === currentUser?.id) &&
                  "fill-primary"
              )}
            />
          ) : (
            <BookmarkIcon
              className={cn(
                "h-5 w-5",
                variant === "details" && "h-6 w-6",
                "fill-accent transition duration-300 group-hover:fill-primary group-focus-visible/button:fill-primary",
                postBookmark?.some((mark) => mark.userId === currentUser?.id) &&
                  "fill-primary"
              )}
            />
          )}
          <span className="sr-only">bookmark post</span>
        </Button>
        <span
          className={cn(
            "h-fit pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
            "font-normal transition duration-300 group-hover:text-primary group-focus:text-primary",
            variant === "default" ? "hidden" : "block"
          )}
        >
          {postBookmark && postBookmark?.length >= 1 && postBookmark?.length}
        </span>
      </div>
    </div>
  );
};
