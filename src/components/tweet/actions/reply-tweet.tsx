import { cn } from "~/lib/utils";
import { TweetProps } from "../tweet-post";
import { CommentIcon } from "~/components/icons";
import { ReplyPostModal } from "~/components/modal";
import { api } from "~/utils/api";

export const ReplyTweet: React.FC<TweetProps> = ({
  variant,
  className,
  post,
  author,
  repostAuthor,
  ...props
}) => {
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;
  const { data: replies } = api.action.replies.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="flex w-full flex-1 text-accent">
      <div
        className="group flex items-center"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <ReplyPostModal
          author={author}
          post={post}
          repostAuthor={repostAuthor}
          key={post.id}
        >
          <CommentIcon
            className={cn(
              "h-5 w-5",
              variant === "details" && "h-6 w-6",
              "fill-accent transition duration-300 group-hover:fill-primary group-focus-visible/button:fill-primary"
            )}
          />
          <span className="sr-only">like</span>
        </ReplyPostModal>
        <span
          className={cn(
            "h-fit pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
            "font-normal transition duration-300 group-hover:text-primary group-focus:text-primary"
          )}
        >
          {replies && replies?.length >= 1 && replies?.length}
        </span>
      </div>
    </div>
  );
};
