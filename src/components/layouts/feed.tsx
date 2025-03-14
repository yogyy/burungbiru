import { LoadingSpinner } from "../loading";
import { RouterOutputs } from "~/utils/api";
import { cn } from "~/lib/utils";
import { TweetParentPost, TweetPost } from "../tweet";
import React from "react";
import { TweetProps } from "../tweet/types";

interface FeedProps {
  posts: TweetProps[] | undefined;
  postLoading: boolean;
  showParent?: boolean;
}

export const Feed = ({ posts, postLoading, showParent = false }: FeedProps) => {
  return (
    <div className="h-auto w-full">
      {postLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        posts?.map((post) => (
          <React.Fragment key={post.id}>
            {post.type === "COMMENT" && post.parentId && (
              <TweetParentPost
                parentId={post.parentId}
                showParent={showParent}
                className={cn(
                  "focus-wihtin:bg-white/[.03] hover:bg-white/[.03]",
                  "group/post transition-colors duration-200 ease-linear"
                )}
              />
            )}
            <TweetPost
              variant="default"
              post={post}
              showParent={showParent}
              className={cn(
                "focus-wihtin:bg-white/[.03] hover:bg-white/[.03]",
                "group/post transition-colors duration-200 ease-linear"
              )}
            />
          </React.Fragment>
        ))
      )}
    </div>
  );
};
