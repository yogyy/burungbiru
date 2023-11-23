import { LoadingSpinner } from "../loading";
import { RouterOutputs } from "~/utils/api";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { TweetPost } from "../tweet";

export const Feed: React.FC<{
  post: RouterOutputs["post"]["timeline"] | undefined;
  postLoading: boolean;
}> = ({ post, postLoading }) => {
  const router = useRouter();
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
            onClick={() => {
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
