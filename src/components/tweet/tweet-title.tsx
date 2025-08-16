import dayjs from "dayjs";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { tweetTime } from "~/lib/tweet";
import { TweetProps, TweetTypeVariant } from "./types";
import { Badge } from "../ui/badge";
import { UserCard } from "../user-hover-card";
import { ReactNode } from "react";

interface TitleProps extends Omit<TweetTypeVariant, "showParent">, Pick<TweetProps, "author"> {
  post: Pick<TweetProps, "id" | "createdAt">;
  children: ReactNode;
}

export const TweetTitle = ({ children, post, author, type, variant }: TitleProps) => {
  return (
    <div className="relative flex w-full flex-nowrap items-center justify-between pt-0.5">
      <div className={cn("flex w-full overflow-hidden", variant === "details" && "flex-col")}>
        {type !== "modal" ? (
          <>
            <UserCard user={author}>
              <div className="flex w-fit">
                <Link
                  onClick={(e) => e.stopPropagation()}
                  className="-mt-0.5 flex w-fit flex-shrink-0 items-center text-base font-[500] outline-none focus-within:underline hover:underline"
                  href={`/p/${author.username}`}
                >
                  {author.name}
                  <Badge variant={author.type} className="-mr-1" />
                </Link>
                <Link
                  tabIndex={-1}
                  onClick={(e) => e.stopPropagation()}
                  className={cn("ml-1 inline-flex w-fit text-accent outline-none")}
                  href={`/p/${author.username}`}
                >
                  {`@${author.username}`}
                </Link>
              </div>
            </UserCard>
          </>
        ) : (
          <>
            <p className="-mt-0.5 flex text-base font-bold outline-none">
              {author.name}
              <Badge variant={author.type} />
            </p>
            <p
              className={cn(
                "inline-flex text-accent outline-none",
                variant === "details" ? "" : "ml-2"
              )}
            >{`@${author.username}`}</p>
          </>
        )}
        {variant !== "details" && (
          <>
            <span className="px-1 text-[15px] leading-5 text-accent">·</span>
            {type === "default" ? (
              <Link
                href={`/post/${post.id}`}
                className="group relative flex w-max flex-shrink-0 items-end text-sm font-thin text-accent outline-none hover:underline focus:underline"
                aria-label={dayjs(post?.createdAt).format("LL LT")}
              >
                <TooltipProvider delayDuration={250}>
                  <Tooltip>
                    <TooltipTrigger asChild className="text-[15px] font-normal leading-5">
                      <time dateTime={post?.createdAt?.toISOString()}>
                        {tweetTime(post?.createdAt ?? post.createdAt)}
                      </time>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="rounded-none border-none bg-[#495A69] p-1 text-xs text-white"
                    >
                      {dayjs(post?.createdAt).format("LT LL")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            ) : (
              <p className="text-[15px] font-normal leading-5 text-accent">
                <time dateTime={post?.createdAt.toISOString()}>
                  {tweetTime(post?.createdAt ?? post.createdAt)}
                </time>
              </p>
            )}
          </>
        )}
      </div>
      {children}
    </div>
  );
};
