import { LoadingSpinner } from "../loading";
import { RouterOutputs } from "~/utils/api";
import { cn } from "~/lib/utils";
import { TweetPost } from "../tweet";

export const Feed: React.FC<{
  post: RouterOutputs["post"]["timeline"]["posts"] | undefined;
  postLoading: boolean;
}> = ({ post, postLoading }) => {
  return (
    <div className="h-auto w-full">
      {postLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        post?.map((fullPost) => (
          <TweetPost
            variant="default"
            {...fullPost}
            key={fullPost.post.id}
            className={cn(
              "focus-wihtin:bg-white/[.03] hover:bg-white/[.03]",
              "group/post transition-colors duration-200 ease-linear"
            )}
          />
        ))
        // <pre className="overflow-x-scroll">{JSON.stringify(post, null, 2)}</pre>
      )}
    </div>
  );
};
