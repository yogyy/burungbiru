import { cn } from "~/lib/utils";
import { TweetProps, VariantTweet } from "../types";
import { CommentIcon } from "~/components/icons";
import dynamic from "next/dynamic";
import { api } from "~/utils/api";
import NumberFlow from "@number-flow/react";
import { numberFlowFormat } from ".";

const ReplyModal = dynamic(
  () => import("~/components/modal/reply-post-modal").then((mod) => mod.ReplyPostModal),
  { ssr: false }
);

interface ReplyProps {
  post: TweetProps;
  variant: VariantTweet;
}

export const ReplyTweet = ({ post, variant }: ReplyProps) => {
  const postId = post.type === "REPOST" ? post.parentId! : post.id;
  const { data } = api.post.replies.useQuery({ postId });

  return (
    <div className="flex w-full flex-1 text-accent" aria-label="reply post">
      <div className="group flex items-center" onClick={(e) => e.stopPropagation()}>
        <ReplyModal post={post} key={post.id}>
          <CommentIcon
            className={cn(
              variant === "details" ? "h-5 w-5" : "h-[18px] w-[18px]",
              "fill-accent transition-colors duration-300 group-hover:fill-primary group-focus-visible/button:fill-primary"
            )}
          />
          <span className="sr-only">reply post</span>
        </ReplyModal>
        {data?.total_replies! > 0 ? (
          <span
            className={cn(
              "h-fit flex-1 overflow-hidden pl-0.5 font-sans text-[13px] leading-4 xs:px-2 md:cursor-pointer",
              "font-normal transition-colors duration-300 group-hover:text-primary group-focus:text-primary"
            )}
          >
            <NumberFlow value={data?.total_replies} format={numberFlowFormat} />
          </span>
        ) : null}
      </div>
    </div>
  );
};
