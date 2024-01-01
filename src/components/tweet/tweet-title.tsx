import Link from "next/link";
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
import { Badge } from "../ui/badge";
import { api } from "~/utils/api";

export const TweetTitle: React.FC<Omit<TweetProps, "repostAuthor">> = ({
  author,
  post,
  variant,
  className,
  type = "default",
  children,
  ...props
}) => {
  const id = post.type === "REPOST" ? post.parentId ?? "" : post.id;
  const { data } = api.post.postViews.useQuery(
    { id },
    { enabled: !!post.parentId }
  );
  const RenderDefault = () => {
    return (
      <>
        <UserCard username={author.username}>
          <Link
            onClick={(e) => e.stopPropagation()}
            className="-mt-0.5 flex flex-shrink-0 items-end text-base font-bold outline-none focus-within:underline hover:underline"
            href={`/@${author.username}`}
          >
            {author.name}
            <Badge variant={author.type} className="-mr-1" />
          </Link>
        </UserCard>
        <UserCard username={author.username}>
          <Link
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "inline-flex w-fit text-accent outline-none",
              variant === "details" ? "" : "ml-1"
            )}
            href={`/@${author.username}`}
          >
            {`@${author.username}`}
          </Link>
        </UserCard>
      </>
    );
  };

  const RenderOnModal = () => {
    return (
      <>
        <p className="-mt-0.5 flex w-full flex-shrink-0 items-end text-base font-bold outline-none">
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
    );
  };

  return (
    <div
      className={cn(
        "relative flex w-full flex-nowrap items-center justify-between pt-0.5",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-full overflow-hidden",
          variant === "details" && "flex-col"
        )}
      >
        {type !== "modal" ? <RenderDefault /> : <RenderOnModal />}
        {variant !== "details" && (
          <>
            <span className="px-1 text-[15px] leading-5 text-accent">·</span>
            <Link
              href={`/post/${post.id}`}
              className="group relative flex w-max flex-shrink-0 items-end text-sm font-thin text-accent outline-none hover:underline focus:underline"
              aria-label={dayjs(data?.createdAt).format("LL LT")}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    className="text-[15px] font-normal leading-5"
                  >
                    <time dateTime={data?.createdAt.toISOString()}>
                      {tweetTime(data?.createdAt ?? post.createdAt)}
                    </time>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="rounded-none border-none bg-[#495A69] p-1 text-xs text-white"
                  >
                    {dayjs(data?.createdAt).format("LT LL")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </>
        )}
      </div>
      {children}
    </div>
  );
};
