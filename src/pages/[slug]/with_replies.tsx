import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React from "react";
import { Feed, UserLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loading";
import UserNotFound from "~/components/user-not-found";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { api } from "~/utils/api";

const ProfilePageReplies: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!user) return <UserNotFound username={username} />;

  const { data, isLoading } = api.profile.userActions.useQuery({
    userId: user.id,
  });

  const replies = data?.repost;

  return (
    <UserLayout
      user={user}
      topbar={
        <div className="flex w-max flex-shrink flex-col justify-center">
          <h1 className="font-sans text-lg font-bold leading-6">
            {`${user?.firstName} ${user?.lastName ? user?.lastName : ""}`}
          </h1>
          <p className="text-[13px] font-thin leading-4 text-accent ">
            {isLoading ? ".." : replies?.length} posts
          </p>
        </div>
      }
    >
      <pre className="w-full overflow-x-scroll">
        {JSON.stringify(replies, null, 2)}
      </pre>
      {/* {userpostLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : null}
      {!userpostLoading && posts && posts?.length !== 0 ? (
        <Feed post={posts} postLoading={userpostLoading} />
      ) : null} */}
    </UserLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

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
