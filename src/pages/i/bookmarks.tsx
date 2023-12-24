import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import React from "react";
import ButtonBack from "~/components/ButtonBack";
import { Feed, PageLayout } from "~/components/layouts";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { SEO } from "~/components/simple-seo";
import { api } from "~/utils/api";

const Bookmarks = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <LoadingPage />;
  if (!user) return;

  const { data: bookmarks, isLoading: userBookmarkLoading } =
    api.profile.userBookmarkedPosts.useQuery({
      userId: user.id,
    });

  return (
    <>
      <SEO title={`Bookmarks / burbir`} />
      <PageLayout className="flex">
        <div className="flex h-full min-h-screen w-full max-w-[600px] flex-col border-x border-border">
          <div className="sticky top-0 z-[25] flex h-auto w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
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

          <div className="flex w-full flex-col items-center">
            {userBookmarkLoading && (
              <div className="flex h-20 items-center justify-center">
                <LoadingSpinner size={24} />
              </div>
            )}
            {!userBookmarkLoading && bookmarks && bookmarks?.length !== 0 && (
              <Feed post={bookmarks} postLoading={userBookmarkLoading} />
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Bookmarks;
