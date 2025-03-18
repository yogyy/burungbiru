import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingItem } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { UserLayout } from "~/components/layouts/user-layout";
import { Feed } from "~/components/layouts/feed";
import UserNotFound from "~/components/user-not-found";
import { authClient } from "~/lib/auth-client";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ProfileContext } from "~/context";

const UserHasNoMedia = ({ userId, username }: { userId: string; username: string }) => {
  const { data } = authClient.useSession();
  return (
    <div className="mx-auto my-8 flex w-full max-w-[calc(5*80px)] flex-col items-center px-8">
      <div className="w-full">
        <h2 className="mb-2 break-words text-left text-[31px] font-extrabold leading-8">
          {userId !== data?.user.id
            ? `@${username} hasn’t posted media`
            : "Lights, camera … attachments!"}
        </h2>
        <p className="mb-8 break-words text-left text-[15px] leading-5 text-accent">
          {userId !== data?.user.id
            ? "Once they do, those posts will show up here."
            : "When you post photos or videos, they will show up here."}
        </p>
      </div>
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });
  const { data: totalMedia, isLoading: totalMediaLoading } = api.profile.userMediaCount.useQuery({
    userId: user!.id,
  });
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });

  const {
    data: posts,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.feed.userPostsWithMedia.useInfiniteQuery(
    { userId: user!.id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!totalMedia }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  if (!user) return <UserNotFound username={username} />;

  return (
    <ProfileContext.Provider value={user}>
      <UserLayout
        title="Media posts"
        topbar={
          <p className="text-[13px] font-thin leading-4 text-accent">
            {totalMediaLoading ? (
              <span className="select-none text-background">loading</span>
            ) : (
              <span>{totalMedia} Photos & videos</span>
            )}
          </p>
        }
      >
        {totalMedia ? (
          <>
            <Feed posts={posts?.pages.flatMap((page) => page.media)} postLoading={isLoading} />
            {inView && isFetchingNextPage && <LoadingItem />}
            {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
          </>
        ) : (
          <UserHasNoMedia userId={user.id} username={user.username} />
        )}
      </UserLayout>
    </ProfileContext.Provider>
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

export default ProfilePage;
