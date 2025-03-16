import { api } from "~/utils/api";
import { cn } from "~/lib/utils";
import { renderText } from "~/lib/tweet";
import { UserCard } from "../user-hover-card";
import { ImageModal } from "../modal/image-modal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useRouter } from "next/router";
import { TweetTypeVariant } from "./types";
import { ReplyTweet } from "./actions/reply-tweet";
import { RepostTweet } from "./actions/repost-tweet";
import { LikeTweet } from "./actions/like-tweet";
import { BookmarkTweet } from "./actions/bookmark-tweet";
import { ShareTweet } from "./actions/share-tweet";
import { TweetText } from "./tweet-text";
import { TweetTitle } from "./tweet-title";
import { TweetMenu } from "./tweet-menu";
import { TweetAction } from "./tweet-action";
dayjs.extend(LocalizedFormat);

interface TweetParentProps extends React.HTMLAttributes<HTMLDivElement>, TweetTypeVariant {
  parentId: string;
  showParent?: boolean;
  enabled?: boolean;
}
export const TweetParentPost = ({
  parentId,
  className,
  type = "default",
  variant = "parent",
  enabled = true,
  showParent,
  ...props
}: TweetParentProps) => {
  const { push, pathname } = useRouter();
  const { data: parent, isLoading } = api.post.detailParentPost.useQuery(
    { id: parentId },
    {
      enabled: !!parentId && enabled,
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
    if (pathname !== "/post/[id]" || isLoading) return null;
    return (
      <article className="px-4 py-3" aria-label="post parent">
        <div className="flex items-center justify-between rounded-2xl border border-[rgb(32,35,39)] bg-[rgb(22,24,28)] px-1 py-3">
          <span className="mx-3 flex flex-wrap text-[15px] leading-5">
            <p className="text-accent">This Post was deleted by the Post author.</p>
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
      case type === "default" && parent?.type === "COMMENT":
        push(`/post/${parent?.id}/#comment`);
        break;
      case type === "default" && parent?.type === "REPOST" && parent?.parentId !== null:
        push(`/post/${parent?.parentId}#comment`);
        break;
      case type === "default" && parent?.type === "REPOST":
        push(`/post/${parent?.parentId}`);
        break;
      default:
        push(`/post/${parent?.id}`);
    }
  };

  return (
    <article
      key={parent.id}
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
          {type !== "modal" && <div className="mx-auto h-2 w-0.5 bg-transparent" />}
          {type === "default" ? (
            <UserCard user={parent.author}>
              <Avatar className="first-letter mt-1 flex h-10 basis-12 rounded-full">
                <AvatarImage width="40" height="40" draggable={false} src={parent.author.image!} />
                <AvatarFallback className="bg-secondary font-semibold text-primary">
                  {parent.author.username.slice(0, 4)}
                </AvatarFallback>
              </Avatar>
            </UserCard>
          ) : (
            <Avatar className="first-letter mt-1 flex h-10 basis-12 rounded-full">
              <AvatarImage width="40" height="40" draggable={false} src={parent.author.image!} />
              <AvatarFallback className="bg-secondary font-semibold text-primary">
                {parent.author.username.slice(0, 4)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="mx-auto mt-1 h-full w-0.5 bg-[rgb(51,54,57)]" />
        </div>
        <div
          className={cn(
            "relative flex w-full flex-col overflow-x-hidden pl-3 pr-4 pt-1",
            type === "default" && "pb-3"
          )}
        >
          <TweetTitle variant={variant} author={parent.author} post={parent} type={type}>
            {type !== "modal" && <TweetMenu post={parent} author={parent.author} />}
          </TweetTitle>
          <div className={cn("flex w-full flex-col justify-start", type === "modal" && "pb-2")}>
            <TweetText content={renderText(parent?.content || "")} />
          </div>
          {parent.image && (
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
                    src={parent.image}
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
            <ReplyTweet post={parent} variant={variant} />
            <RepostTweet post={parent} variant={variant} />
            <LikeTweet post={parent} variant={variant} />
            <BookmarkTweet post={parent} variant="default" />
            <ShareTweet author={parent.author} variant={variant} postId={parent.id} />
          </TweetAction>
        </div>
      </div>
    </article>
  );
};
