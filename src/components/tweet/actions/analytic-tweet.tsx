import { Button } from "~/components/ui/button";
import { cn, formatViews } from "~/lib/utils";
import { AnalyticIcon } from "~/components/icons";
import { api } from "~/utils/api";
import { TweetProps } from "../types";

interface AnalyticTweetProps
  extends Omit<TweetProps, "author" | "repostAuthor"> {}
export const AnalyticTweet = ({ variant, post }: AnalyticTweetProps) => {
  const id = post.type === "REPOST" ? post.parentId ?? "" : post.id;
  const { data } = api.post.postViews.useQuery(
    { id },
    { enabled: !!post.parentId }
  );
  return (
    <div
      className={cn(
        "flex w-full flex-1 text-accent",
        variant === "details" ? "hidden" : ""
      )}
      aria-label="analytic post"
    >
      <div
        className="group flex items-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button
          variant="ghost"
          type="button"
          size="icon"
          className={cn(
            "group/button z-10 -mr-2 flex border-2 transition-all ease-in",
            "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10"
          )}
        >
          <AnalyticIcon
            className={cn(
              "h-5 w-5",
              variant === "details" && "h-6 w-6",
              "fill-accent transition duration-300 group-hover:fill-primary group-focus-visible/button:fill-primary"
            )}
          />
          <span className="sr-only">analytic post</span>
        </Button>
        <span
          className={cn(
            "h-fit pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
            "font-normal transition duration-300 group-hover:text-primary group-focus:text-primary"
          )}
        >
          {post.type === "REPOST"
            ? data?.view && data?.view !== 0 && formatViews(data?.view)
            : post.view !== 0 && formatViews(post.view)}
        </span>
      </div>
    </div>
  );
};
