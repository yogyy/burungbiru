import React from "react";
import { TweetButton } from "~/constant";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { TweetType } from "./tweet-post";

export const TweetAction: React.FC<Pick<TweetType, "variant">> = (props) => {
  const { variant } = props;
  return (
    <div className="relative z-10 -mr-2 flex" {...props}>
      <div className="-ml-2 mt-3 flex h-5 flex-1 flex-shrink-0 flex-row border-x border-transparent xs:gap-1">
        {TweetButton.map((btn) => (
          <div
            className={cn(
              "flex w-full flex-1 text-accent",
              btn.name === "Share" && "w-fit flex-none justify-end",
              variant !== "details" && btn.name === "Bookmark"
                ? "w-fit flex-none justify-end"
                : "",
              variant === "details" && btn.name === "Analytic" ? "hidden" : ""
            )}
            key={btn.name}
          >
            <div
              className="group flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                onClick={() => btn.action}
                type="button"
                size="icon"
                className={cn(
                  "group/button z-10 -mr-2 flex border-2 transition-all ease-in last:mr-0",
                  "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10",
                  btn.name === "Repost" &&
                    "hover:bg-[#00BA7C]/10 focus-visible:border-[#00BA7C]/50 focus-visible:bg-[#00BA7C]/10 group-hover:bg-[#00BA7C]/10",
                  btn.name === "Like" &&
                    "hover:bg-[#F91880]/10 focus-visible:border-[#F91880]/50 focus-visible:bg-[#F91880]/10 group-hover:bg-[#F91880]/10"
                )}
              >
                <btn.icon
                  className={cn(
                    "w-5",
                    variant === "details" && "w-6",
                    "fill-accent transition duration-300 group-hover:fill-primary group-focus-visible/button:fill-primary",
                    btn.name === "Repost" &&
                      "group-hover:fill-[#00BA7C] group-focus-visible/button:fill-[#00BA7C]",
                    btn.name === "Like" &&
                      "group-hover:fill-[#F91880] group-focus-visible/button:fill-[#F91880]"
                  )}
                />
                <span className="sr-only">{btn.name}</span>
              </Button>
              {btn.name !== "Share" && (
                <span
                  className={cn(
                    "h-fit pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
                    "font-normal transition duration-300 group-hover:text-primary group-focus:text-primary",
                    btn.name === "Repost" &&
                      "group-hover:text-[#00BA7C] group-focus:text-[#00BA7C]",
                    btn.name === "Like" &&
                      "group-hover:text-[#F91880] group-focus:text-[#F91880]",
                    variant !== "details" && btn.name === "Bookmark"
                      ? "!hidden"
                      : ""
                  )}
                >
                  ??
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
