import React from "react";
import { PostView } from "../postView";
import { LoadingSpinner } from "../loading";
import { RouterOutputs } from "~/utils/api";
import { useRouter } from "next/navigation";

const Feed = ({
  post,
  postLoading,
}: {
  post: RouterOutputs["posts"]["getAll"];
  postLoading: boolean;
}) => {
  const router = useRouter();

  return (
    <div className="h-auto w-full">
      {postLoading ? (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size={60} />
        </div>
      ) : (
        post &&
        post.map((fullPost) => (
          <PostView
            {...fullPost}
            key={fullPost.post.id}
            onClick={() => router.push(`/post/${fullPost.post.id}`)}
            className="cursor-pointer focus-within:bg-white/5 hover:bg-white/5"
          />
        ))
      )}
    </div>
  );
};

export default Feed;
