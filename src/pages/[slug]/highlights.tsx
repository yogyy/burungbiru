import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { Feed, UserLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loading";
import { Button, buttonVariants } from "~/components/ui/button";
import UserNotFound from "~/components/user-not-found";
import { cn } from "~/lib/utils";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { api } from "~/utils/api";

const ProfilePageReplies: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!user) return <UserNotFound username={username} />;

  const { data: posts, isLoading: userpostLoading } =
    api.profile.userPosts.useQuery({
      userId: user?.id,
    });

  return (
    <UserLayout
      user={user}
      topbar={
        <div className="flex w-max flex-shrink flex-col justify-center">
          <h1 className="font-sans text-lg font-bold leading-6">
            {`${user?.firstName} ${user?.lastName ? user?.lastName : ""}`}
          </h1>
          <p className="text-[13px] font-thin leading-4 text-accent ">
            {userpostLoading ? ".." : posts?.length} posts
          </p>
        </div>
      }
    >
      <div className="mx-auto my-8 flex w-full max-w-[calc(5*80px)] flex-col items-center px-8">
        <div className="w-full">
          <h2 className="mb-2 break-words text-left text-[31px] font-extrabold leading-8">
            Highlight on your profile
          </h2>
          <p className="mb-8 break-words text-left text-[15px] leading-5 text-accent">
            You must be subscribed to Premium to highlight posts on your
            profile.
          </p>
          <Link
            href="#/subscribe-premium"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "min-h-[52px] max-w-fit flex-1 flex-grow whitespace-nowrap break-words px-8 text-base font-bold leading-5"
            )}
          >
            Subscribe to Premium
          </Link>
        </div>
      </div>
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
