import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingItem } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { UserLayout } from "~/components/layouts/user-layout";
import { Feed } from "~/components/layouts/feed";
import UserNotFound from "~/components/user-not-found";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (!user) return <UserNotFound username={username} />;

  const {
    data: posts,
    isLoading: userpostLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.feed.userPosts.useInfiniteQuery(
    { userId: user?.id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!user }
  );

  return (
    <UserLayout username={username}>
      <Feed posts={posts?.pages.flatMap((page) => page.posts)} postLoading={userpostLoading} />
      <div className="h-[100dvh]"></div>
      {inView && isFetchingNextPage && <LoadingItem />}
      {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
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
