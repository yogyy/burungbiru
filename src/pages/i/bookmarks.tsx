import { SignIn, clerkClient, currentUser, useUser } from "@clerk/nextjs";
import Head from "next/head";
import React from "react";
import ButtonBack from "~/components/ButtonBack";
import { Feed, PageLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loading";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

const Bookmarks = ({ userId }: { userId: string }) => {
  const { user, isLoaded } = useUser();
  if (!user) return <SignIn />;

  const { data: bookmarks, isLoading: userBookmarkLoading } =
    api.profile.userBookmarkedPosts.useQuery({
      userId,
    });

  return (
    <>
      <Head>
        <title>{`Bookmarks / burbir`}</title>
      </Head>
      <PageLayout className="flex">
        <div className="flex h-full min-h-screen w-full max-w-[600px] flex-col border-x border-border">
          <div className="sticky top-0 z-20 flex h-auto w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
            <div className="relative flex h-[53px] w-full items-center md:max-w-[600px]">
              <div className="-ml-2 block w-14 min-[570px]:hidden">
                <ButtonBack />
              </div>
              <div className="flex w-max flex-shrink flex-col justify-center">
                <h1 className="font-sans text-xl font-bold leading-6">
                  Bookmarks
                </h1>
                <p className="text-[14px] font-thin leading-4 text-accent">
                  @{user?.username}
                </p>
              </div>
            </div>
          </div>

          {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
          <div className="flex w-full flex-col items-center">
            {userBookmarkLoading ? (
              <div className="flex h-20 items-center justify-center">
                <LoadingSpinner size={24} />
              </div>
            ) : null}
            {!userBookmarkLoading && bookmarks && bookmarks?.length !== 0 ? (
              <Feed post={bookmarks} postLoading={userBookmarkLoading} />
            ) : null}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Bookmarks;

import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { generateSSGHelper } from "~/server/helper/ssgHelper";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  const ssg = generateSSGHelper();

  if (!userId)
    return {
      notFound: true,
    };

  const _User = await clerkClient.users.getUser(userId);

  await ssg.profile.userBookmarkedPosts.prefetch({ userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};
