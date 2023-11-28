import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { LoadingSpinner } from "~/components/loading";
import ButtonBack from "~/components/ButtonBack";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { Button } from "~/components/ui/button";
import { userMenu } from "~/constant";
import { cn } from "~/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { PageLayout, Feed, UserLayout } from "~/components/layouts";
import { ImageModal } from "~/components/modal";
import UserNotFound from "~/components/user-not-found";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!user) return <UserNotFound username={username} />;

  const { data: posts, isLoading: userpostLoading } =
    api.post.userPosts.useQuery({
      userId: user?.id,
    });

  // const { data } = api.profile.userActions.useQuery({
  //   userId: user.id,
  // });

  // console.log(data);

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
      {userpostLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : null}
      {!userpostLoading && posts && posts?.length !== 0 ? (
        <Feed post={posts} postLoading={userpostLoading} />
      ) : null}
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

export default ProfilePage;
