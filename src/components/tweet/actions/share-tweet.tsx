import { useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { TweetProps } from "../tweet-post";
import { ShareIcon } from "~/components/icons";

export const ShareTweet: React.FC<Omit<TweetProps, "author">> = ({
  variant,
  className,
  post,
  ...props
}) => {
  return (
    <div
      className={cn("hidden w-fit flex-none justify-end text-accent xs:flex")}
      {...props}
    >
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          type="button"
          size="icon"
          className={cn(
            "group/button z-10 flex border-2 transition-all ease-in",
            "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10"
          )}
        >
          <ShareIcon
            className={cn(
              "h-5 w-5",
              variant === "details" && "h-6 w-6",
              "fill-accent transition duration-300 group-hover:fill-primary group-focus-visible/button:fill-primary"
            )}
          />
          <span className="sr-only">share</span>
        </Button>
      </div>
    </div>
  );
};
