import Link from "next/link";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import dayjs from "dayjs";
import { TweetProps } from "./tweet-post";
import { cn } from "~/lib/utils";
import { tweetTime } from "~/lib/tweet";
import { UserCard } from "../user-hover-card";
import { TweetMenu } from "./tweet-menu";
import { useMediaQuery } from "~/hooks/use-media-q";
import { useIsClient } from "~/hooks/use-client";

export const TweetTitle: React.FC<TweetProps> = ({
  author,
  post,
  repostAuthor,
  variant,
  className,
  type,
  ...props
}) => {
  const isClient = useIsClient();
  const onDekstop = useMediaQuery("(min-width: 768px)");
  const authorPost = post.type === "POST" ? author : repostAuthor;

  return (
    <div
      className={cn(
        "relative flex w-full flex-nowrap items-center justify-between",
        className
      )}
      {...props}
    >
      <div
        className={cn("flex flex-wrap", variant === "details" && "flex-col")}
      >
        {isClient && onDekstop && type === "default" ? (
          <>
            <UserCard author={author}>
              <Link
                onClick={(e) => e.stopPropagation()}
                className="-mt-0.5 flex flex-shrink-0 items-start text-base font-bold outline-none focus-within:underline hover:underline"
                href={`/@${author.username}`}
              >
                {`${author.firstName} ${
                  author.lastName !== null ? author.lastName : ""
                }`}
              </Link>
            </UserCard>
            <UserCard author={author}>
              <Link
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "inline-flex text-accent outline-none",
                  variant === "details" ? "" : "ml-2"
                )}
                href={`/@${author.username}`}
              >
                {`@${author.username}`}
              </Link>
            </UserCard>
          </>
        ) : (
          <>
            <Link
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "-mt-0.5 flex flex-shrink-0 items-start text-base font-bold outline-none focus-within:underline hover:underline",
                variant === "details" ? "" : "mr-2"
              )}
              href={`/@${author.username}`}
            >
              {`${author.firstName} ${
                author.lastName !== null ? author.lastName : ""
              }`}
            </Link>
            <Link
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className={cn("inline-flex text-accent outline-none")}
              href={`/@${author.username}`}
            >
              {`@${author.username}`}
            </Link>
          </>
        )}
        {variant !== "details" ? (
          <>
            <span className="px-1 text-[15px] leading-5 text-accent">·</span>
            <Link
              href={`/post/${post.id}`}
              className="group relative flex w-max flex-shrink-0 items-end text-sm font-thin text-accent outline-none hover:underline focus:underline"
              aria-label={dayjs(post.createdAt).format("LL LT")}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    className="text-[15px] font-normal leading-5"
                  >
                    <time dateTime={post.createdAt.toISOString()}>
                      {tweetTime(post.createdAt)}
                    </time>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="rounded-none border-none bg-[#495A69] p-1 text-xs text-white"
                  >
                    {dayjs(post.createdAt).format("LT LL")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </>
        ) : null}
      </div>
      {type !== "modal" && (
        <TweetMenu post={post} author={author} repostAuthor={repostAuthor} />
      )}
    </div>
  );
};
