import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ButtonBack } from "~/components/button-back";
import { Feed } from "~/components/layouts/feed";
import { PageLayout } from "~/components/layouts/root-layout";
import { LoadingItem } from "~/components/loading";
import { api } from "~/utils/api";

const Bookmarks = () => {
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });

  const {
    data: bookmarks,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = api.feed.userBookmarks.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      <PageLayout>
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

          <div className="flex w-full flex-col items-center">
            <Feed
              posts={bookmarks?.pages.flatMap((item) => item.bookmarks)}
              postLoading={isLoading}
            />
            {inView && isFetchingNextPage && <LoadingItem />}
            {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Bookmarks;
