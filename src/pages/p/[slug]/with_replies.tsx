import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React from "react";
import { Feed, UserLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loading";
import { SEO } from "~/components/simple-seo";
import UserNotFound from "~/components/user-not-found";
import { getUserbyUsername } from "~/hooks/queries";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { api } from "~/utils/api";

const ProfilePageReplies: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = getUserbyUsername({ username });
  if (!user) return <UserNotFound username={username} />;

  const { data: replies, isLoading } = api.profile.userWithReplies.useQuery({
    userId: user.id,
  });

  return (
    <UserLayout
      user={user}
      title={`Post with replies by ${user?.name} (@${user?.username}) / burbir`}
    >
      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        replies &&
        replies?.length >= 1 && (
          <Feed post={replies} postLoading={isLoading} showParent={true} />
        )
      )}
    </UserLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const username = context.params?.slug;
  if (typeof username !== "string") throw new Error("no slug");

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

export default ProfilePageReplies;
