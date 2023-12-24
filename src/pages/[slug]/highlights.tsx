import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { UserLayout } from "~/components/layouts";
import { buttonVariants } from "~/components/ui/button";
import UserNotFound from "~/components/user-not-found";
import { getUserbyUsername } from "~/hooks/query";
import { cn } from "~/lib/utils";
import { generateSSGHelper } from "~/server/helper/ssgHelper";

const ProfilePageReplies: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = getUserbyUsername({ username });
  if (!user) return <UserNotFound username={username} />;

  return (
    <UserLayout
      user={user}
      title={`${user?.name} (@${user?.username}) / burbir`}
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
