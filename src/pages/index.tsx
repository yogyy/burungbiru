import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import React from "react";

import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import Feed from "~/components/layouts/feed";
import { CreateTweet } from "~/components/form";
import { Logo } from "~/components/icons/navbar-icon";
import { cn } from "~/lib/utils";
import { BurgerMenu } from "~/components/layouts/hamburger-menu";
import { useMediaQuery } from "~/hooks/use-media-q";

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();
  const matches = useMediaQuery("(min-width: 570px)");

  if (!userLoaded)
    return (
      <div className="flex h-[100dvh] w-screen items-center justify-center">
        <Logo width={80} height={80} className="text-white/10" />
      </div>
    );

  return (
    <PageLayout className="flex">
      <div className="flex w-full max-w-[600px] flex-shrink flex-col border-x border-border">
        {!matches ? <BurgerMenu isSignedIn={isSignedIn} user={user} /> : null}
        <div
          className={cn(
            "sticky top-0 z-20 h-auto w-full border-b border-border bg-background/[.65] backdrop-blur-md"
          )}
        >
          <div className="flex h-[53px] items-center">
            <div className="relative  flex h-full w-full flex-1 items-center justify-center px-4 font-semibold hover:cursor-pointer">
              <div className="relative flex h-full w-fit items-center">
                For You
                <span className="absolute -left-0.5 bottom-0 h-1 w-[108%] rounded-md bg-primary" />
              </div>
            </div>
            <div className="relative flex h-full w-full flex-1 items-center justify-center px-4 font-medium text-accent hover:cursor-pointer">
              Following
            </div>
          </div>
        </div>
        <div className="hidden border-b border-border min-[570px]:flex">
          {isSignedIn ? <CreateTweet /> : null}
        </div>
        {<Feed post={data} postLoading={postLoading} />}
      </div>
    </PageLayout>
  );
};

export default Home;
