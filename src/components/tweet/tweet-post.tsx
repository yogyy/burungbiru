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
        "relative w-full max-w-full border-b border-border px-4 outline-none",
        className
      )}
      {...props}
    >
      <div className="relative flex w-full pt-3">
        <div className="mr-3 h-auto w-10 flex-shrink-0 basis-10">
          <Image
            width={40}
            height={40}
            draggable={false}
            src={author.profileImg}
            alt={`@${author.username || author.lastName}'s profile picture`}
            className="first-letter flex basis-12 rounded-full"
          />
        </div>
        <div className="relative w-full flex-col overflow-hidden pb-3">
          <TweetTitle
            variant={variant}
            author={author}
            post={post}
            user={user}
          />
          <div className="flex w-fit justify-start">
            <TweetText content={renderText(post.content)} />
          </div>
          <div className="relative flex h-fit w-full">
            <div className="relative mt-3 w-fit items-start overflow-hidden rounded-2xl border">
              <div className="relative h-full w-full max-w-full transition-colors duration-200 hover:bg-secondary">
                <img
                  src="https://pbs.twimg.com/media/F9iEb7LbkAAHnw3?format=webp&name=medium"
                  alt="test"
                  className="max-h-[510px] w-full object-cover xs:min-w-[382.5px] "
                />
              </div>
            </div>
          </div>
          <TweetAction />
        </div>
      </div>
    </div>
  );
};
