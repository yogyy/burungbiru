import { useEffect } from "react";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
import { type NextPage } from "next";
import { useMediaQuery } from "usehooks-ts";
import { SEO } from "~/components/simple-seo";
import { useInView } from "react-intersection-observer";
import { LoadingItem, LoadingPage } from "~/components/loading";
import { BurgerMenu, PageLayout, Feed } from "~/components/layouts";
import { authClient } from "~/lib/auth-client";

const LazyForm = dynamic(() => import("~/components/form/tweet-form"));

const Home: NextPage = () => {
  const ctx = api.useUtils();
  const { isPending } = authClient.useSession();
  const showBurgerMenu = useMediaQuery("(max-width: 570px)");

  if (isPending) <LoadingPage />;

  const { ref, inView } = useInView({ rootMargin: "40% 0px" });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: feedLoading,
  } = api.feed.home.useInfiniteQuery(
    { limit: 3 },
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
      <SEO title="Home / burbir" />
      <PageLayout>
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
          <Feed posts={data?.pages.flatMap((page) => page.posts)} postLoading={feedLoading} />
          {inView && isFetchingNextPage && <LoadingItem />}
          {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
        </div>
      </PageLayout>
    </>
  );
};

export default Home;
