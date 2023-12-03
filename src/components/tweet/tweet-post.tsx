import Image from "next/image";
import { RouterOutputs } from "~/utils/api";
import { cn } from "~/lib/utils";
import { renderText } from "~/lib/tweet";
import { UserCard } from "../user-hover-card";
import { ImageModal } from "../modal";
import { TweetTitle, TweetText, TweetAction } from "./";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { RetweetIcon } from "../icons";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
dayjs.extend(LocalizedFormat);

type VariantTweet = "default" | "details" | "parent";

export type TweetProps = RouterOutputs["post"]["detailPost"] &
  React.HTMLAttributes<HTMLDivElement> & { variant?: VariantTweet };

export const TweetPost: React.FC<TweetProps> = ({
  post,
  author,
  repostAuthor,
  variant = "default",
  className,
  ...props
}) => {
  const { user: currentUser } = useUser();
  const { pathname } = useRouter();
  const postAuthor = post.type === "REPOST" ? repostAuthor : author;
  const { push } = useRouter();

  const toPostDetails = () => {
    switch (true) {
      case post.type === "COMMENT":
        push(`/post/${post.id}/#comment`);
        break;
      case post.type === "REPOST" && post.parentId !== null:
        push(`/post/${post.parentId}#comment`);
        break;
      case post.type === "REPOST":
        push(`/post/${post.parentId}`);
        break;
      default:
        push(`/post/${post.id}`);
    }
  };

  return (
    <div
      key={post.id}
      className={cn(
        "relative w-full max-w-full overflow-hidden border-b border-border pl-4 outline-none md:cursor-pointer",
        className
      )}
      onClick={toPostDetails}
      {...props}
    >
      {post.type === "REPOST" && (
        <div className="-mb-3 flex items-center break-words pt-1 text-[13px] font-bold text-accent">
          <div className="mr-3 flex flex-grow-0 basis-10 justify-end">
            <RetweetIcon className="" />
          </div>
          <Link href={`/@${repostAuthor.username}`} className="hover:underline">
            {currentUser?.id !== post.authorRepostId
              ? `${repostAuthor.firstName} ${
                  repostAuthor.lastName !== null ? repostAuthor.lastName : ""
                } `
              : "you "}{" "}
            reposted
          </Link>
        </div>
      )}
      <article className="relative flex w-full overflow-hidden">
        <div className="h-auto w-10 flex-shrink-0 basis-10">
          <div
            className={cn(
              "mx-auto h-2 w-0.5 bg-transparent",
              post.type === "COMMENT" &&
                variant !== "parent" &&
                pathname === "/" &&
                " bg-[rgb(51,54,57)]"
            )}
          />
          <UserCard author={author}>
            <Image
              width="40"
              height="40"
              draggable={false}
              src={author.profileImg}
              alt={`@${author.username || author.lastName}'s profile picture`}
              className="first-letter mt-1 flex h-10 basis-12 rounded-full"
            />
          </UserCard>
          {variant === "parent" && (
            <div className="mx-auto mt-1 h-full w-0.5 bg-[rgb(51,54,57)]" />
          )}
        </div>
        <div className="relative flex w-full flex-col overflow-x-hidden pb-3 pl-3 pr-4 pt-1">
          <TweetTitle
            variant={variant}
            author={author}
            post={post}
            repostAuthor={repostAuthor}
          />
          <div className="flex w-full justify-start">
            <TweetText content={renderText(post.content)} />
          </div>
          {post.image ? (
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
          ) : null}
          <TweetAction
            post={post}
            variant={variant}
            author={author}
            repostAuthor={repostAuthor}
          />
        </div>
      </article>
    </div>
  );
};
