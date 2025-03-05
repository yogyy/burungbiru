import Image from "next/image";
import { api } from "~/utils/api";
import { cn } from "~/lib/utils";
import { renderText } from "~/lib/tweet";
import { UserCard } from "../user-hover-card";
import { ImageModal } from "../modal";
import { TweetTitle, TweetText, TweetAction, TweetMenu } from "./";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useRouter } from "next/router";
import {
  AnalyticTweet,
  BookmarkTweet,
  LikeTweet,
  ReplyTweet,
  RepostTweet,
  ShareTweet,
} from "./actions";
import { TweetTypeVariant } from "./types";
dayjs.extend(LocalizedFormat);

interface TweetParentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    TweetTypeVariant {
  id: string;
  showParent?: boolean;
}
export const TweetParentPost = ({
  id,
  className,
  type = "default",
  variant = "parent",
  showParent,
  ...props
}: TweetParentProps) => {
  const { push, pathname } = useRouter();
  const { data: parent } = api.post.parentPost.useQuery(
    { parentId: id },
    {
      enabled: !!id,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.data?.code === "NOT_FOUND") {
          return false;
        }
        return true;
      },
    }
  );
  if (!showParent) return null;
  if (!parent) {
    if (pathname !== "/post/[id]") return null;
    return (
      <article className="px-4 py-3" aria-label="post parent">
        <div className="flex items-center justify-between rounded-2xl border border-[rgb(32,35,39)] bg-[rgb(22,24,28)] px-1 py-3">
          <span className="mx-3 flex flex-wrap text-[15px] leading-5">
            <p className="text-accent">
              This Post was deleted by the Post author.
            </p>
            &nbsp;
            <a
              href="https://help.twitter.com/en/rules-and-policies/notices-on-x"
              target="_blank"
              className="text-primary"
            >
              Learn More
            </a>
          </span>
        </div>
      </article>
    );
  }

  const toPostDetails = () => {
    switch (true) {
      case type === "default" && parent?.post.type === "COMMENT":
        push(`/post/${parent?.post.id}/#comment`);
        break;
      case type === "default" &&
        parent?.post.type === "REPOST" &&
        parent?.post.parentId !== null:
        push(`/post/${parent?.post.parentId}#comment`);
        break;
      case type === "default" && parent?.post.type === "REPOST":
        push(`/post/${parent?.post.parentId}`);
        break;
      default:
        push(`/post/${parent?.post.id}`);
    }
  };

  return (
    <article
      key={parent.post.id}
      className={cn(
        "relative w-full max-w-full overflow-hidden pl-4 outline-none",
        "md:cursor-pointer",
        className
      )}
      onClick={toPostDetails}
      aria-label="post parent"
      {...props}
    >
      <div className="relative flex w-full overflow-hidden">
        <div className="h-auto w-10 flex-shrink-0 basis-10">
          {type !== "modal" && (
            <div className={cn("mx-auto h-2 w-0.5 bg-transparent")} />
          )}
          {type === "default" ? (
            <UserCard username={parent.author.username}>
              <Image
                width="40"
                height="40"
                draggable={false}
                src={parent.author.image!}
                alt={`@${parent.author.name}'s profile picture`}
                className="first-letter mt-1 flex h-10 basis-12 rounded-full"
              />
            </UserCard>
          ) : (
            <Image
              width="40"
              height="40"
              draggable={false}
              src={parent.author.image!}
              alt={`@${parent.author.name}'s profile picture`}
              className="first-letter mt-1 flex h-10 basis-12 rounded-full"
            />
          )}
          <div className="mx-auto mt-1 h-full w-0.5 bg-[rgb(51,54,57)]" />
        </div>
        <div
          className={cn(
            "relative flex w-full flex-col overflow-x-hidden pl-3 pr-4 pt-1",
            type === "default" && "pb-3"
          )}
        >
          <TweetTitle
            variant={variant}
            author={parent.author}
            post={parent.post}
            type={type}
          >
            {type !== "modal" && (
              <TweetMenu post={parent.post} author={parent.author} />
            )}
          </TweetTitle>
          <div
            className={cn(
              "flex w-full flex-col justify-start",
              type === "modal" && "pb-2"
            )}
          >
            <TweetText content={renderText(parent.post.content)} />
          </div>
          {parent.post.image && (
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
                    src={parent.post.image}
                    width="600"
                    height="400"
                    alt={`${parent.author.username}'s image`}
                    className="max-h-[510px] w-full object-cover xs:min-w-[382.5px]"
                  />
                </div>
              </button>
            </div>
          )}
          <TweetAction>
            <ReplyTweet
              post={parent.post}
              variant={variant}
              author={parent.author}
              repostAuthor={parent.repostAuthor}
            />
            <RepostTweet post={parent.post} variant={variant} />
            <LikeTweet post={parent.post} variant={variant} />
            <AnalyticTweet post={parent.post} variant={variant} />
            <BookmarkTweet post={parent.post} variant="default" />
            <ShareTweet
              post={parent.post}
              variant={variant}
              author={parent.author}
            />
          </TweetAction>
        </div>
      </div>
    </article>
  );
};
