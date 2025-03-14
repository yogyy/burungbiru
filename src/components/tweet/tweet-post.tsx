import { cn } from "~/lib/utils";
import { renderText } from "~/lib/tweet";
import { UserCard } from "../user-hover-card";
import { ImageModal } from "../modal";
import { TweetTitle, TweetText, TweetAction, TweetMenu } from "./";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { RetweetIcon } from "../icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReplyTweet } from "./actions/reply-tweet";
import { RepostTweet } from "./actions/repost-tweet";
import { LikeTweet } from "./actions/like-tweet";
import { BookmarkTweet } from "./actions/bookmark-tweet";
import { ShareTweet } from "./actions/share-tweet";
import { TweetProps, TweetTypeVariant } from "./types";
import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
dayjs.extend(LocalizedFormat);

interface PostProps extends React.HTMLAttributes<HTMLDivElement>, TweetTypeVariant {
  post: TweetProps;
}

export const TweetPost = ({
  post,
  variant = "default",
  type = "default",
  showParent,
  className,
  ...props
}: PostProps) => {
  const { data } = authClient.useSession();
  const { pathname } = useRouter();
  const { push } = useRouter();
  const toPostDetails = () => {
    switch (true) {
      case type === "modal":
        break;
      case type === "default" && post.type === "COMMENT":
        push(`/post/${post.id}/#comment`);
        break;
      case type === "default" && post.type === "REPOST" && post.parentId !== null:
        push(`/post/${post.parentId}/#comment`);
        break;
      case type === "default" && post.type === "REPOST":
        push(`/post/${post.parentId}`);
        break;
      default:
        push(`/post/${post.id}`);
    }
  };

  const currentPost = post.type === "REPOST" ? post.parent! : post;

  const shouldShowReplyingTo =
    post.type === "COMMENT" && type !== "modal" && !showParent && pathname !== "/post/[id]";

  if (post.type === "REPOST" && post.parent?.author.username === post.author.username) return null;

  return (
    <article
      key={post.id}
      className={cn(
        "relative w-full max-w-full overflow-hidden border-b border-border pl-4 outline-none",
        type === "modal" ? "cursor-default" : "md:cursor-pointer",
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
          <UserCard user={post.author} align="center">
            <Link href={`/p/${post.author.username}`} className="hover:underline">
              {data?.user.username !== post.author.username ? post.author.name : "you "} reposted
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
            <UserCard user={post.type === "REPOST" ? post.parent?.author! : post.author}>
              <Avatar className="first-letter mt-1 flex h-10 basis-12 rounded-full">
                <AvatarImage
                  width="40"
                  height="40"
                  draggable={false}
                  src={post.type === "REPOST" ? post.parent?.author.image! : post.author.image!}
                />
                <AvatarFallback className="bg-secondary font-semibold text-primary">
                  {post.type === "REPOST"
                    ? post.parent?.author.username!.slice(0, 4)
                    : post.author.username.slice(0, 4)}
                </AvatarFallback>
              </Avatar>
            </UserCard>
          ) : (
            <Avatar className="first-letter mt-1 flex h-10 basis-12 rounded-full">
              <AvatarImage
                width="40"
                height="40"
                draggable={false}
                src={post.type === "REPOST" ? post.parent?.author.image! : post.author.image!}
              />
              <AvatarFallback className="bg-secondary font-semibold text-primary">
                {post.type === "REPOST"
                  ? post.parent?.author.username!.slice(0, 4)
                  : post.author.username.slice(0, 4)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div
          className={cn(
            "relative flex w-full flex-col overflow-x-hidden pl-3 pr-4 pt-2",
            type === "default" && "pb-3"
          )}
        >
          <TweetTitle
            variant={variant}
            author={post.type === "REPOST" ? post.parent?.author! : post.author}
            post={post.type === "REPOST" ? post.parent! : post}
            type={type}
          >
            {type !== "modal" && (
              <TweetMenu
                author={post.type === "REPOST" ? post.parent?.author! : post.author}
                post={post}
              />
            )}
          </TweetTitle>
          <div className={cn("flex w-full flex-col justify-start", type === "modal" && "pb-2")}>
            {shouldShowReplyingTo ? (
              <div className="-mt-1 text-sm text-accent">
                Replying to&nbsp;
                <Link
                  href={`/p/${post.author.username}`}
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{post.type === "REPOST" ? post.parent?.author.username! : post.author.username}
                </Link>
              </div>
            ) : null}
            <TweetText
              content={renderText(post.type === "REPOST" ? post.parent?.content! : post.content!)}
            />
          </div>
          {currentPost?.image && type !== "modal" && (
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
                    src={currentPost.image}
                    width="600"
                    height="400"
                    alt="post's image"
                    className="max-h-[510px] w-full object-cover xs:min-w-[382.5px]"
                  />
                </div>
              </button>
            </div>
          )}
          {type === "default" ? (
            <TweetAction>
              <ReplyTweet post={post} variant={variant} />
              <RepostTweet post={post} variant={variant} />
              <LikeTweet post={post} variant={variant} />
              <BookmarkTweet post={post} variant={variant} />
              <ShareTweet postId={currentPost?.id} author={currentPost?.author} variant={variant} />
            </TweetAction>
          ) : (
            <p className="pb-2 text-accent">
              replying to&nbsp;
              <span className="text-primary">
                @{post.type === "REPOST" ? post.parent?.author.username! : post.author.username}
              </span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
};
