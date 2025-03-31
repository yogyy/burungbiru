import { GetStaticPaths, GetStaticProps } from "next";
import { ReactElement, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { UserLayout } from "~/components/layouts/user-layout";
import { LoadingItem } from "~/components/loading";
import UserNotFound from "~/components/user-not-found";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layouts/root-layout";
import { TweetPost } from "~/components/tweet/tweet-post";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { TweetParentPost } from "~/components/tweet/tweet-parent-post";

interface Props {
  userId: string;
}

const UserRepliesPost = ({ userId }: Props) => {
  const { ref, inView } = useInView({ rootMargin: "40% 0px" });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.feed.userReplies.useInfiniteQuery(
      { userId },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const allPosts = data ? data.pages.flatMap((d) => d.comments) : [];
  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    estimateSize: () => 250,
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
        {virtualItems.map(({ index, key, size, start }) => {
          const post = allPosts[index]!;
          return (
            <div
              key={key}
              data-index={index}
              className="w-full"
              ref={rowVirtualizer.measureElement}
            >
              <TweetParentPost
                parent={post?.parent}
                showParent={true}
                className="focus-wihtin:bg-white/[.03] group/post transition-colors duration-200 ease-linear hover:bg-white/[.03]"
              />
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

const ProfilePageReplies = ({ username }: { username: string }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });

  if (!user) return <UserNotFound username={username} />;

  return (
    <UserLayout username={username} title="Posts with replies">
      <UserRepliesPost userId={user.id} />
    </UserLayout>
  );
};

ProfilePageReplies.getLayout = function getLayout(page: ReactElement) {
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

export default ProfilePageReplies;
