import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "~/utils/api";
import { LoadingItem } from "../loading";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { TweetPost } from "./tweet-post";

interface CommentsProps {
  postId: string;
  enabled: boolean;
}

export const Comments = ({ postId, enabled }: CommentsProps) => {
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    api.feed.postReplies.useInfiniteQuery(
      { postId },
      { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled }
    );

  const allPosts = data ? data.pages.flatMap((d) => d.comments) : [];
  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    estimateSize: () => 150,
    overscan: 4,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) return <LoadingItem />;

  return (
    <div className="relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
      <div
        className="absolute left-0 top-0 w-full"
        style={{ transform: `translateY(${virtualItems[0]?.start ?? 0}px)` }}
      >
        {virtualItems.map(({ index, key, size, start }) => {
          const post = allPosts[index]!;
          return (
            <div
              key={key}
              data-index={index}
              className="w-full"
              ref={rowVirtualizer.measureElement}
            >
              <TweetPost
                variant="default"
                post={post}
                showParent={false}
                className="focus-wihtin:bg-white/[.03] group/post h-full transition-colors duration-200 ease-linear hover:bg-white/[.03]"
              />
            </div>
          );
        })}
        <div ref={ref}>{inView && isFetchingNextPage && <LoadingItem />}</div>
      </div>
    </div>
  );
};
