import { cn } from "~/lib/utils";
import { TweetProps } from "./tweet-post";
import { api } from "~/utils/api";
import {
  ReplyTweet,
  RepostTweet,
  LikeTweet,
  BookmarkTweet,
  AnalyticTweet,
  ShareTweet,
} from "./actions";

export const TweetAction: React.FC<TweetProps> = ({
  variant,
  className,
  post,
  author,
  repostAuthor,
  ...props
}) => {
  return (
    <div className={cn("relative z-10 -mr-2 flex", className)} {...props}>
      <div className="-ml-2 mt-3 flex h-5 flex-1 flex-shrink-0 flex-row border-x border-transparent xs:gap-1">
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
      </div>
    </div>
  );
};
