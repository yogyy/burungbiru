import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactElement, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ButtonBack } from "~/components/button-back";
import { PageLayout } from "~/components/layouts/root-layout";
import { LoadingItem } from "~/components/loading";
import { TweetPost } from "~/components/tweet/tweet-post";
import { api } from "~/utils/api";

const Bookmarks = () => {
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });
  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } =
    api.feed.userBookmarks.useInfiniteQuery(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const allPosts = data ? data.pages.flatMap((d) => d.bookmarks) : [];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="flex h-full min-h-screen w-full max-w-[600px] flex-col border-x border-border">
      <div className="sticky top-0 z-[25] flex h-auto w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
        <div className="relative flex h-[53px] w-full items-center md:max-w-[600px]">
          <div className="-ml-2 block w-14 min-[570px]:hidden">
            <ButtonBack />
          </div>
          <div className="flex w-max flex-shrink flex-col justify-center">
            <h1 className="font-sans text-xl font-bold leading-6">Bookmarks</h1>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingItem />
      ) : (
        <div className="relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          <div
            className="absolute left-0 top-0 w-full"
            style={{ transform: `translateY(${virtualItems[0]?.start ?? 0}px)` }}
          >
            {virtualItems.map(({ index, key }) => {
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
      )}
    </div>
  );
};

Bookmarks.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default Bookmarks;
