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

  const { data: replies, isLoading } = api.profile.userWithReplies.useQuery({
    userId: user.id,
  });

  return (
    <UserLayout user={user}>
      <pre className="w-full overflow-x-scroll">
        {JSON.stringify(replies, null, 2)}
      </pre>
      {isLoading && (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      )}
      {!isLoading && replies && replies?.length !== 0 && (
        <Feed post={replies} postLoading={isLoading} />
      )}
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
