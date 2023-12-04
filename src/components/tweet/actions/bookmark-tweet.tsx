import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { TweetProps } from "../tweet-post";
import { BookmarkIcon, BookmarkIconFill } from "~/components/icons";
import { toast } from "react-hot-toast";

export const BookmarkTweet: React.FC<
  Omit<TweetProps, "author" | "repostAuthor">
> = ({ variant, className, post, ...props }) => {
  const ctx = api.useUtils();
  const { mutate: addToBookmark } = api.action.bookmarkPost.useMutation({
    onSuccess() {
      ctx.action.bookmarks.invalidate({ postId: post.id });
      ctx.post.interactions.invalidate({ id: post.id });
      toast.success("Added to your Bookmarks", {
        id: `${post.id}-addbookmark`,
      });
    },
  });
  const { mutate: deleteBookmark } = api.action.unbookmarkPost.useMutation({
    onSuccess() {
      ctx.post.interactions.invalidate({ id: post.id });
      ctx.profile.userBookmarkedPosts.invalidate().then(() =>
        toast.success("Removed from your Bookmarks", {
          id: `${post.id}-removebookmark`,
        })
      );
    },
  });

  const { user: currentUser } = useUser();

  const { data } = api.post.interactions.useQuery(
    {
      id: post.id,
    },
    { refetchOnWindowFocus: false }
  );
  const postBookmark = data?.bookmarks;
  return (
    <div
      className={cn(
        "flex w-full flex-1 text-accent",
        variant !== "details" && "w-fit flex-none justify-end"
      )}
    >
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <Button
          variant="ghost"
          onClick={() => {
            if (
              !postBookmark?.some((mark) => mark.userId === currentUser?.id)
            ) {
              addToBookmark({ postId: post.id });
            } else {
              deleteBookmark({ postId: post.id });
            }
          }}
          type="button"
          size="icon"
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
          <span className="sr-only">bookmark</span>
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
