import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { UserLayout } from "~/components/layouts/user-layout";
import { Feed } from "~/components/layouts/feed";
import { LoadingItem } from "~/components/loading";
import UserNotFound from "~/components/user-not-found";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { api } from "~/utils/api";

const ProfilePageReplies: NextPage<{ username: string }> = ({ username }) => {
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
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.feed.userReplies.useInfiniteQuery(
    { userId: user?.id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!user }
  );

  return (
    <UserLayout username={username} title="Posts with replies">
      <Feed
        posts={posts?.pages.flatMap((page) => page.comments)}
        postLoading={isLoading}
        showParent={true}
      />
      {inView && isFetchingNextPage && <LoadingItem />}
      {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
    </UserLayout>
  );
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

export default ProfilePageReplies;
