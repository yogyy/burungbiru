import React from "react";
import { Analytic, Bookmark, Comment, Like, Retweet, Share } from "../icons";
import { cn } from "~/lib/utils";

const TweetButton = [
  { name: "Reply", icon: Comment, action: null },
  { name: "Repost", icon: Retweet, action: null },
  { name: "Like", icon: Like, action: null },
  { name: "Analytic", icon: Analytic, action: null },
  { name: "Bookmark", icon: Bookmark, action: null },
  { name: "Share", icon: Share, action: null },
];
export const TweetAction = () => {
  return (
    <div className="relative flex">
      <div className="mt-3 flex h-5 flex-1 flex-row gap-1">
        {TweetButton.map((button) => (
          <div
            className={cn(
              "flex w-full flex-1 cursor-pointer text-accent",
              button.name === "Share" && "w-fit flex-none justify-end",
              button.name === "Bookmark" && "w-fit flex-none justify-end"
            )}
            key={button.name}
          >
            <div className="group flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  button.action;
                }}
                className={cn(
                  "-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full transition duration-300 last:mr-0 hover:bg-primary/20",
                  button.name === "Repost" && "hover:bg-[#00BA7C]/20",
                  button.name === "Like" && "hover:bg-[#F91880]/20"
                )}
              >
                <span
                  className={cn(
                    "w-5 fill-accent transition duration-300 group-hover:fill-primary",
                    button.name === "Repost" && "group-hover:fill-[#00BA7C]",
                    button.name === "Like" && "group-hover:fill-[#F91880]"
                  )}
                >
                  <button.icon />
                </span>
              </button>
              {button.name !== "Bookmark" && button.name !== "Share" && (
                <span
                  className={cn(
                    "h-fit min-w-[calc(1em_+_24px)] px-2 font-sans text-[13px] leading-4 transition duration-300 group-hover:text-primary",
                    button.name === "Repost" && "group-hover:text-[#00BA7C]",
                    button.name === "Like" && "group-hover:text-[#F91880]"
                  )}
                >
                  20
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="-mb-4 flex h-8 w-8 items-center justify-center">
        <button disabled className="inline-flex h-5 w-5">
          <span className="fill-accent">
            <Share />
          </span>
        </button>
      </div> */}
    </div>
  );
};
