import { GetStaticPaths, GetStaticProps } from "next";
import { api, RouterOutputs } from "~/utils/api";
import { LoadingItem } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { UserLayout } from "~/components/layouts/user-layout";
import UserNotFound from "~/components/user-not-found";
import { authClient } from "~/lib/auth-client";
import { useInView } from "react-intersection-observer";
import { ReactElement, useEffect } from "react";
import { PageLayout } from "~/components/layouts/root-layout";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { TweetPost } from "~/components/tweet/tweet-post";

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

interface UserMediaProps {
  userId: string;
}

const UserPostsWithMedia = ({ userId }: UserMediaProps) => {
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.feed.userPostsWithMedia.useInfiniteQuery(
      { userId },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const allPosts = data ? data.pages.flatMap((d) => d.media) : [];
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
};

const UserMediaPage = ({ username }: { username: string }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });

  if (!user) return <UserNotFound username={username} />;

  const { data: totalMedia, isLoading: totalMediaLoading } = api.profile.userMediaCount.useQuery({
    userId: user.id,
  });

  return (
    <UserLayout
      username={username}
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
      {totalMedia === 0 && <UserHasNoMedia userId={user.id} username={user.username} />}
      <UserPostsWithMedia userId={user.id} />
    </UserLayout>
  );
};

UserMediaPage.getLayout = function getLayout(page: ReactElement) {
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

export default UserMediaPage;
