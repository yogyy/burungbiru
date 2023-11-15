import React from "react";
import { LoadingSpinner } from "../loading";
import { RouterOutputs } from "~/utils/api";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { TweetPost } from "../tweet";

type FeedType = {
  post: RouterOutputs["posts"]["getAll"];
  postLoading: boolean;
};

const Feed = ({ post, postLoading }: FeedType) => {
  const router = useRouter();
  return (
    <div className="h-auto w-full">
      {postLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        post.map((fullPost) => (
          <TweetPost
            variant="default"
            {...fullPost}
            key={fullPost.post.id}
            onClick={(e) => {
              router.push(`/post/${fullPost.post.id}`);
            }}
            className={cn(
              "focus-wihtin:bg-white/[.03] hover:bg-white/[.03]",
              "group/post transition-colors duration-200 ease-linear"
            )}
          />
        ))
      )}
    </div>
  );
};

export default Feed;
