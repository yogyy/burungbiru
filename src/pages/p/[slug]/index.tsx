import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "~/utils/api";
import { LoadingItem } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { UserLayout } from "~/components/layouts/user-layout";
import UserNotFound from "~/components/user-not-found";
import { useInView } from "react-intersection-observer";
import { ReactElement, useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { TweetPost } from "~/components/tweet/tweet-post";
import { PageLayout } from "~/components/layouts/root-layout";

function UserPosts({ userId }: { userId: string }) {
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.feed.userPosts.useInfiniteQuery(
      { userId: userId },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
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

  if (isLoading) return <LoadingItem />;

  return (
    <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
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
  );
}

const ProfilePage = ({ username }: { username: string }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });

  if (!user) return <UserNotFound username={username} />;

  return (
    <UserLayout username={username}>
      <UserPosts userId={user.id} />
    </UserLayout>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const username = context.params?.slug;
  if (typeof username !== "string") throw new Error("no slug");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: { trpcState: ssg.dehydrate(), username },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
