import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "~/utils/api";
import { LoadingItem } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import UserNotFound from "~/components/user-not-found";
import { authClient } from "~/lib/auth-client";
import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { UserLayout } from "~/components/layouts/user-layout";
import { TweetPost } from "~/components/tweet/tweet-post";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { PageLayout } from "~/components/layouts/root-layout";

const UserHasnoLikes = () => {
  return (
    <div className="mx-auto my-8 flex w-full max-w-[calc(5*80px)] flex-col items-center px-8">
      <div className="w-full">
        <h2 className="mb-2 break-words text-left text-[31px] font-extrabold leading-8">
          You haven&apos;t liked any Posts yet
        </h2>
        <p className="mb-8 break-words text-left text-[15px] leading-5 text-accent">
          When you like post, they will show up here.
        </p>
      </div>
    </div>
  );
};

function UserLikedPosts({ enabled, userId }: { userId: string; enabled: boolean }) {
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.feed.userLikes.useInfiniteQuery(
      { userId },
      { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled }
    );

  const allPosts = data ? data.pages.flatMap((d) => d.likes) : [];
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
}

const UserLikesPage = ({ username }: { username: string }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });
  const { data } = authClient.useSession();

  const { push } = useRouter();

  useEffect(() => {
    if (username !== data?.user.username) {
      push(`/p/${username}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, data?.user.username]);

  if (!user) return <UserNotFound username={username} />;

  const { data: totalLikes, isLoading: totalLikesLoading } = api.profile.userLikesCount.useQuery(
    { userId: user.id },
    { enabled: !!user }
  );

  return (
    <UserLayout
      username={username}
      title="Posts liked"
      topbar={
        <p className="text-[13px] font-thin leading-4 text-accent">
          {totalLikesLoading ? (
            <span className="select-none text-background">loading</span>
          ) : (
            <span>{totalLikes} Likes</span>
          )}
        </p>
      }
    >
      <div className="w-full">
        {username === data?.user.username && totalLikes === 0 && <UserHasnoLikes />}
        <UserLikedPosts userId={user.id} enabled={!!(username === data?.user.username)} />
      </div>
    </UserLayout>
  );
};

UserLikesPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const username = context.params?.slug;
  if (typeof username !== "string") throw new Error("no slug");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default UserLikesPage;
