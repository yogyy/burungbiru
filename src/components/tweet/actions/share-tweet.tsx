import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { TweetProps } from "../types";
import { ShareIcon } from "~/components/icons";
import { toast } from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";

interface ShareTweetProps extends Omit<TweetProps, "repostAuthor"> {}
export const ShareTweet = ({ variant, post, author }: ShareTweetProps) => {
  const [value, copy] = useCopyToClipboard();
  const { user: currentUser } = useUser();

  function copyPostUrl() {
    copy(`${window.location.origin}/@${author.username}/${post.id}`);
    toast.success("Copied to clipboard", { id: `copy ${post.id}` });
    console.log(value);
  }

  return (
    <div
      className="hidden w-fit flex-none justify-end text-accent xs:flex"
      aria-label="share post"
    >
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          type="button"
          size="icon"
          disabled={currentUser?.id === author.id}
          onClick={copyPostUrl}
          className={cn(
            "group/button z-10 flex border-2 transition-all ease-in",
            currentUser?.id === author.id
              ? "hover:bg-none"
              : "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10"
          )}
        >
          <ShareIcon
            className={cn(
              "h-5 w-5",
              variant === "details" && "h-6 w-6",
              "fill-accent transition duration-300",
              currentUser?.id !== author.id &&
                "group-hover:fill-primary group-focus-visible/button:fill-primary"
            )}
          />
          <span className="sr-only">share post</span>
        </Button>
      </div>
    </div>
  );
};
