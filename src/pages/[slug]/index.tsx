import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingItem } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { Feed, UserLayout } from "~/components/layouts";
import UserNotFound from "~/components/user-not-found";
import { useInView } from "react-intersection-observer";
import { getUserbyUsername } from "~/hooks/query";
import { SEO } from "~/components/simple-seo";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = getUserbyUsername({ username });
  const { ref, inView } = useInView({
    rootMargin: "40% 0px",
  });

  if (!user) return <UserNotFound username={username} />;

  const {
    data: posts,
    isLoading: userpostLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.profile.userPosts.useInfiniteQuery(
    { userId: user?.id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  if (hasNextPage && inView && !userpostLoading) {
    fetchNextPage();
  }

  return (
    <UserLayout
      user={user}
      title={`${user?.name} (@${user?.username}) / burbir`}
    >
      <Feed
        post={posts?.pages.flatMap((page) => page.posts)}
        postLoading={userpostLoading}
      />
      {inView && isFetchingNextPage && <LoadingItem />}
      {hasNextPage && <div ref={ref} />}
    </UserLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsernameDB.prefetch({ username });

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

export default ProfilePage;
