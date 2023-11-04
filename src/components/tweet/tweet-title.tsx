import Link from "next/link";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import dayjs from "dayjs";
import { TweetType } from "./tweet-post";
import { cn } from "~/lib/utils";
import { tweetTime } from "~/lib/tweet";
import { UserCard } from "../user-hover-card";
import { TweetMenu } from "./tweet-menu";

const TweetTitle: React.FC<TweetType> = (props) => {
  const { author, post, variant } = props;

  return (
    <div className="flex w-full flex-wrap items-center justify-between">
      <div className={cn("flex", variant === "details" && "flex-col")}>
        <UserCard author={author}>
          <Link
            onClick={(e) => e.stopPropagation()}
            className="-mt-0.5 flex items-start break-words text-base font-bold outline-none focus-within:underline hover:underline"
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
            className="ml-2 inline-flex text-accent outline-none"
            href={`/@${author.username}`}
          >
            {`@${author.username}`}
          </Link>
        </UserCard>
        <span className="px-1 text-[15px] leading-5 text-accent">·</span>
        <Link
          href={`/post/${post.id}`}
          className="group relative flex w-max items-end text-sm font-thin text-accent outline-none hover:underline focus:underline"
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
      </div>

      <TweetMenu post={post} author={author} />
    </div>
  );
};

export { TweetTitle };
