import Image from "next/image";
import { RouterOutputs } from "~/utils/api";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { renderText } from "~/lib/tweet";
import { TweetTitle } from "./tweet-title";
import { TweetText } from "./tweet-text";
import { TweetAction } from "./tweet-action";
import { UserCard } from "../user-hover-card";
import { ImageModal } from "../modal/image-modal";
dayjs.extend(LocalizedFormat);

type VariantTweet = "default" | "details";

export type TweetType = RouterOutputs["posts"]["getAll"][number] &
  React.HTMLAttributes<HTMLDivElement> & { variant?: VariantTweet };

export const TweetPost: React.FC<TweetType> = ({
  post,
  author,
  variant = "default",
  className,
  ...props
}) => {
  const { user } = useUser();

  return (
    <div
      key={post.id}
      className={cn(
        "relative w-full max-w-full overflow-hidden border-b border-border pl-4 outline-none md:cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="relative flex w-full overflow-hidden pt-1">
        <div className="mt-2 h-auto w-10 flex-shrink-0 basis-10">
          <UserCard author={author}>
            <Image
              width={40}
              height={40}
              draggable={false}
              src={author.profileImg}
              alt={`@${author.username || author.lastName}'s profile picture`}
              className="first-letter flex basis-12 rounded-full"
            />
          </UserCard>
        </div>
        <div className="relative flex w-full flex-col overflow-x-hidden pb-3 pl-3 pr-4">
          <TweetTitle variant={variant} author={author} post={post} />
          <div className="flex w-full justify-start">
            <TweetText content={renderText(post.content)} />
          </div>
          {post.image ? (
            <div
              className="relative flex h-fit w-full xs:w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="relative mt-3 flex w-full items-start justify-center overflow-hidden rounded-2xl border xs:w-fit">
                <div className="relative h-full w-fit max-w-full transition-colors duration-200 hover:bg-secondary xs:w-full">
                  <ImageModal
                    src={post.image as string}
                    alt="test"
                    className="max-h-[510px] w-full object-cover xs:min-w-[382.5px]"
                  />
                </div>
              </button>
            </div>
          ) : null}
          <TweetAction />
        </div>
      </div>
    </div>
  );
};
