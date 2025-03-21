import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingItem } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import UserNotFound from "~/components/user-not-found";
import { authClient } from "~/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { UserLayout } from "~/components/layouts/user-layout";
import { Feed } from "~/components/layouts/feed";

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

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });
  const { data } = authClient.useSession();

  const { push } = useRouter();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (username !== data?.user.username) {
      push(`/p/${username}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return <UserNotFound username={username} />;

  const { data: totalLikes, isLoading: totalLikesLoading } = api.profile.userLikesCount.useQuery(
    { userId: user.id },
    { enabled: !!user }
  );

  const {
    data: posts,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.feed.userLikes.useInfiniteQuery(
    { userId: user.id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!totalLikes }
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
      <div className="flex w-full flex-col items-center">
        {totalLikes! > 0 ? (
          <>
            <Feed
              posts={posts?.pages.flatMap((page) => page.likes)}
              postLoading={isLoading}
              showParent={false}
            />
            {inView && isFetchingNextPage && <LoadingItem />}
            {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
          </>
        ) : (
          <UserHasnoLikes />
        )}
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

export default ProfilePage;
