import { ReactElement, useEffect } from "react";
import { api } from "~/utils/api";
import { useMediaQuery } from "usehooks-ts";
import { SEO } from "~/components/simple-seo";
import { useInView } from "react-intersection-observer";
import { LoadingItem, LoadingPage } from "~/components/loading";
import { authClient } from "~/lib/auth-client";
import { PageLayout } from "~/components/layouts/root-layout";
import { BurgerMenu } from "~/components/layouts/hamburger-menu";
import dynamic from "next/dynamic";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { TweetPost } from "~/components/tweet/tweet-post";

const LazyForm = dynamic(() => import("~/components/form/tweet-form"), { ssr: false });

const Home = () => {
  const ctx = api.useUtils();

  const { data: session, isPending } = authClient.useSession();
  const showBurgerMenu = useMediaQuery("(max-width: 570px)");
  const { ref, inView } = useInView({ rootMargin: "1000px" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.feed.home.useInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!session }
    );

  const allPosts = data ? data.pages.flatMap((d) => d.posts) : [];
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

  if (isPending) return <LoadingPage />;

  return (
    <>
      <SEO title="Home / burbir" />
      <div className="flex w-full max-w-[600px] flex-shrink flex-col overflow-hidden border-x border-border">
        {showBurgerMenu && <BurgerMenu />}
        <div className="sticky top-0 z-[25] h-auto w-full border-b border-border bg-background/[.65] backdrop-blur-md">
          <div className="flex h-[53px] items-center">
            <button
              type="button"
              className="relative flex h-full w-full flex-1 items-center justify-center px-4 font-semibold hover:cursor-pointer"
              onClick={() => ctx.feed.home.invalidate()}
            >
              <div className="relative flex h-full w-fit items-center">
                For You
                <span className="absolute -left-0.5 bottom-0 h-1 w-[108%] rounded-md bg-primary" />
              </div>
            </button>
            <button
              type="button"
              className="relative flex h-full w-full flex-1 items-center justify-center px-4 font-medium text-accent hover:cursor-pointer"
            >
              Following
            </button>
          </div>
        </div>
        {!showBurgerMenu && (
          <div className="hidden border-b border-border min-[570px]:flex">
            <LazyForm />
          </div>
        )}
        {isLoading ? (
          <LoadingItem />
        ) : (
          <div className="relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
            <div
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualItems[0]?.start ?? 0}px)` }}
            >
              {virtualItems.map(({ index, key }) => {
                const post = allPosts[index];
                return (
                  <div
                    key={key}
                    data-index={index}
                    className="w-full"
                    ref={rowVirtualizer.measureElement}
                  >
                    <TweetPost
                      variant="default"
                      post={post!}
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
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default Home;
