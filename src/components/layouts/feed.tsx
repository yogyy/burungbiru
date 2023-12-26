import { LoadingSpinner } from "../loading";
import { RouterOutputs } from "~/utils/api";
import { cn } from "~/lib/utils";
import { TweetParentPost, TweetPost } from "../tweet";
import React from "react";

export const Feed: React.FC<{
  post: RouterOutputs["post"]["timeline"]["posts"] | undefined;
  postLoading: boolean;
  showParent?: boolean;
}> = ({ post, postLoading, showParent = false }) => {
  return (
    <div className="h-auto w-full">
      {postLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        post?.map((fullPost) => (
          <React.Fragment key={fullPost.post.id}>
            {fullPost.post.parentId && fullPost.post.type === "COMMENT" && (
              <TweetParentPost
                id={fullPost.post.parentId}
                showParent={showParent}
                className={cn(
                  "focus-wihtin:bg-white/[.03] hover:bg-white/[.03]",
                  "group/post transition-colors duration-200 ease-linear"
                )}
              />
            )}
            <TweetPost
              variant="default"
              {...fullPost}
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
