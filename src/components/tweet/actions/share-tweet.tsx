import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { TweetProps, VariantTweet } from "../types";
import { ShareIcon } from "~/components/icons";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { authClient } from "~/lib/auth-client";

interface ShareTweetProps {
  post: TweetProps;
  variant: VariantTweet;
}
export const ShareTweet = ({ variant, post }: ShareTweetProps) => {
  const [_, copy] = useCopyToClipboard();
  const { data } = authClient.useSession();

  function copyPostUrl() {
    copy(`${window.location.origin}/p/${post.author.username}/${post.id}`);
    toast.success("Copied to clipboard", { id: `copy ${post.id}` });
  }

  return (
    <div className="hidden w-fit flex-none justify-end text-accent xs:flex" aria-label="share post">
      <div className="group flex items-center" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          type="button"
          size="icon"
          disabled={data?.user.username === post.author.username}
          onClick={copyPostUrl}
          className={cn(
            "group/button z-10 flex border-2 transition-all ease-in",
            data?.user.username === post.author.username
              ? "hover:bg-none"
              : "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10"
          )}
        >
          <ShareIcon
            className={cn(
              variant === "details" ? "h-5 w-5" : "h-[18px] w-[18px]",
              "fill-accent transition duration-300",
              data?.user.username !== post.author.username &&
                "group-hover:fill-primary group-focus-visible/button:fill-primary"
            )}
          />
          <span className="sr-only">share post</span>
        </Button>
      </div>
    </div>
  );
};
