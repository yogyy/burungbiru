import React from "react";
import { TweetButton } from "~/constant";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { TweetType } from "./tweet-post";

export const TweetAction: React.FC<TweetType> = (props) => {
  const { variant } = props;
  return (
    <div className="relative z-10 -ml-2 -mr-2 flex" {...props}>
      <div className="mt-3 flex h-5 flex-1 flex-row gap-1 border-x border-transparent">
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
                size="icon"
                variant="ghost"
                onClick={() => btn.action}
                type="button"
                className={cn(
                  "group/button z-10 -mr-2 flex border-2 transition-all ease-in",
                  "last:mr-0 hover:bg-primary/10 focus-visible:border-primary/50",
                  btn.name === "Repost" &&
                    "hover:bg-[#00BA7C]/10 focus-visible:border-[#00BA7C]/50",
                  btn.name === "Like" &&
                    "hover:bg-[#F91880]/10 focus-visible:border-[#F91880]/50",
                  ""
                )}
              >
                <span
                  className={cn(
                    "fill-accent transition duration-300 group-hover:fill-primary group-focus-visible/button:fill-primary",
                    btn.name === "Repost" &&
                      "group-hover:fill-[#00BA7C] group-focus-visible/button:fill-[#00BA7C]",
                    btn.name === "Like" &&
                      "group-hover:fill-[#F91880] group-focus-visible/button:fill-[#F91880]"
                  )}
                >
                  <btn.icon
                    className={cn("w-5", variant === "details" && "w-6")}
                  />
                </span>
                <span className="sr-only">{btn.name}</span>
              </Button>
              {btn.name !== "Share" && (
                <span
                  className={cn(
                    "hidden h-fit min-w-[calc(1em_+_24px)] px-2 font-sans text-[13px] leading-4 xs:block md:cursor-pointer",
                    "transition duration-300 group-focus-within:text-primary group-hover:text-primary",
                    btn.name === "Repost" &&
                      "group-focus-within:text-[#00BA7C] group-hover:text-[#00BA7C]",
                    btn.name === "Like" &&
                      "group-focus-within:text-[#F91880] group-hover:text-[#F91880]",
                    variant !== "details" && btn.name === "Bookmark"
                      ? "!hidden"
                      : ""
                  )}
                >
                  20
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
