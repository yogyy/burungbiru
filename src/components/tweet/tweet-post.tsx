import Image from "next/image";
import { cn } from "~/lib/utils";
import { renderText } from "~/lib/tweet";
import { UserCard } from "../user-hover-card";
import { ImageModal } from "../modal";
import { TweetTitle, TweetText, TweetAction, TweetMenu } from "./";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { RetweetIcon } from "../icons";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import {
  AnalyticTweet,
  BookmarkTweet,
  LikeTweet,
  ReplyTweet,
  RepostTweet,
  ShareTweet,
} from "./actions";
import { TweetProps } from "./types";
dayjs.extend(LocalizedFormat);

interface TweetPostProps
  extends React.HTMLAttributes<HTMLDivElement>,
    TweetProps {}
export const TweetPost = ({
  post,
  author,
  repostAuthor,
  variant = "default",
  type = "default",
  showParent,
  className,
  ...props
}: TweetPostProps) => {
  const { user: currentUser } = useUser();
  const { pathname } = useRouter();
  const { push } = useRouter();
  const toPostDetails = () => {
    switch (true) {
      case type === "default" && post.type === "COMMENT":
        push(`/post/${post.id}/#comment`);
        break;
      case type === "default" &&
        post.type === "REPOST" &&
        post.parentId !== null:
        push(`/post/${post.parentId}#comment`);
        break;
      case type === "default" && post.type === "REPOST":
        push(`/post/${post.parentId}`);
        break;
      default:
        push(`/post/${post.id}`);
    }
  };

  return (
    <article
      key={post.id}
      className={cn(
        "relative w-full max-w-full overflow-hidden border-b border-border pl-4 outline-none",
        type === "modal" ? "cursor-text" : "md:cursor-pointer",
        className
      )}
      onClick={toPostDetails}
      aria-label="post"
      {...props}
    >
      {post.type === "REPOST" && type === "default" && (
        <div className="-mb-3 flex items-center break-words pt-1 text-[13px] font-bold text-accent">
          <div className="mr-3 flex flex-grow-0 basis-10 justify-end">
            <RetweetIcon />
          </div>
          <UserCard username={repostAuthor.username!}>
            <Link
              href={`/@${repostAuthor.username}`}
              className="hover:underline"
            >
              {currentUser?.id !== post.authorParentId
                ? `${repostAuthor.name} `
                : "you "}{" "}
              reposted
            </Link>
          </UserCard>
        </div>
      )}
      <div className="relative flex w-full overflow-hidden">
        <div className="h-auto w-10 flex-shrink-0 basis-10">
          {type !== "modal" && (
            <div
              className={cn(
                "mx-auto h-2 w-0.5 bg-transparent",
                post.type === "COMMENT" &&
                  variant !== "parent" &&
                  showParent &&
                  "bg-[rgb(51,54,57)]"
              )}
            />
          )}
          {type === "default" ? (
            <UserCard username={author.username}>
              <Image
                width="40"
                height="40"
                draggable={false}
                src={author.imageUrl}
                alt={`@${author.name}'s profile picture`}
                className="first-letter mt-1 flex h-10 basis-12 rounded-full"
              />
            </UserCard>
          ) : (
            <Image
              width="40"
              height="40"
              draggable={false}
              src={author.imageUrl}
              alt={`@${author.name}'s profile picture`}
              className="first-letter mt-1 flex h-10 basis-12 rounded-full"
            />
          )}
        </div>
        <div
          className={cn(
            "relative flex w-full flex-col overflow-x-hidden pl-3 pr-4 pt-2",
            type === "default" && "pb-3"
          )}
        >
          <TweetTitle variant={variant} author={author} post={post} type={type}>
            {type !== "modal" && <TweetMenu post={post} author={author} />}
          </TweetTitle>
          <div
            className={cn(
              "flex w-full flex-col justify-start",
              type === "modal" && "pb-2"
            )}
          >
            {post.type === "COMMENT" &&
              type !== "modal" &&
              !showParent &&
              pathname !== "/post/[id]" && (
                <div className="-mt-1 text-accent">
                  Replying to&nbsp;
                  <UserCard username={repostAuthor.username!}>
                    <Link
                      href={`/@${repostAuthor.username}`}
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      @{repostAuthor.username}
                    </Link>
                  </UserCard>
                </div>
              )}
            <TweetText content={renderText(post.content)} />
          </div>
          {post.image && type !== "modal" && (
            <div
              className="relative flex h-fit w-full xs:w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="relative mt-3 flex w-full items-start justify-center overflow-hidden rounded-2xl border xs:w-fit"
                type="button"
              >
                <div className="relative h-full w-full max-w-full transition-colors duration-200 hover:bg-secondary">
                  <ImageModal
                    src={post.image}
                    width="600"
                    height="400"
                    alt={`${author.username}'s image`}
                    className="max-h-[510px] w-full object-cover xs:min-w-[382.5px]"
                  />
                </div>
              </button>
            </div>
          )}
          {type === "default" ? (
            <TweetAction>
              <ReplyTweet
                post={post}
                variant={variant}
                author={author}
                repostAuthor={repostAuthor}
              />
              <RepostTweet post={post} variant={variant} />
              <LikeTweet post={post} variant={variant} />
              <AnalyticTweet post={post} variant={variant} />
              <BookmarkTweet post={post} variant={variant} />
              <ShareTweet post={post} variant={variant} author={author} />
            </TweetAction>
          ) : (
            <p className="pb-2 text-accent">
              replying to&nbsp;
              <span className="text-primary">@{author.username}</span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
};
