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
import { PageLayout, Feed } from "~/components/layouts";
import { ImageModal } from "~/components/modal";
import UserNotFound from "~/components/user-not-found";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const [showModal, setShowModal] = useState(false);
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });
  const { data: posts, isLoading: userpostLoading } =
    api.post.userPosts.useQuery({
      userId: user?.id as string,
    });

  const { user: currentUser } = useUser();
  if (!user) return <UserNotFound username={username} />;

  return (
    <>
      <Head>
        <title>
          {`${user?.firstName} ${user?.lastName || null} (@${
            user?.username
          }) / burbir`}
        </title>
      </Head>
      <PageLayout className="flex">
        <div className="flex h-full w-full max-w-[600px] flex-col border-x border-border">
          <div className="sticky top-0 z-20 flex h-auto w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
            <div className="relative flex h-[53px] w-full items-center md:max-w-[600px]">
              <div className="-ml-2 w-14">
                <ButtonBack />
              </div>
              <div className="flex w-max flex-shrink flex-col justify-center">
                <h1 className="font-sans text-lg font-bold leading-6">
                  {`${user?.firstName} ${user?.lastName ? user?.lastName : ""}`}
                </h1>
                <p className="text-[13px] font-thin leading-4 text-accent ">
                  {userpostLoading ? ".." : posts?.length} posts
                </p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[3/1] w-full overflow-hidden">
            <ImageModal
              alt={`banner @${user?.username}`}
              src="https://pbs.twimg.com/media/F8H50sjbYAAUr-1?format=webp&name=small"
              width="600"
              height="200"
              priority
              className="h-full max-h-[12.5rem] w-full bg-no-repeat object-cover brightness-75"
            />
          </div>
          <div className="px-4 pb-3 pt-3">
            <div className="relative flex w-full flex-wrap justify-between">
              <div className="-mt-[15%] mb-3 h-auto w-1/4 min-w-[48px]">
                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <DialogTrigger className="rounded-full">
                    <Image
                      src={user?.profileImg as string}
                      alt={`${
                        user?.username ?? user?.firstName ?? "unknown"
                      }'s profile pic`}
                      width="140"
                      height="140"
                      className={cn(
                        "cursor-pointer rounded-full border-background bg-background object-cover p-1"
                      )}
                      draggable={false}
                    />
                  </DialogTrigger>
                  <DialogOverlay
                    className="bg-background/90 duration-75"
                    onClick={() => setShowModal((prev) => !prev)}
                  />
                  <DialogContent
                    className="h-full max-w-md items-center overflow-hidden rounded-md border-none border-transparent bg-transparent shadow-none outline-none md:h-auto"
                    overlayClassName="bg-background/40"
                  >
                    <Image
                      src={user?.profileImg as string}
                      alt={`${
                        user?.username ?? user?.firstName ?? "unknown"
                      }'s profile pic`}
                      width="370"
                      height="370"
                      className="w-full rounded-full bg-background/60"
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {currentUser?.id === user.id ? (
                <Button
                  variant="outline"
                  className="focus-visible:border-1 rounded-full border-border py-4 hover:bg-[rgba(239,243,244,0.1)] focus-visible:bg-[rgba(239,243,244,0.1)]"
                  type="button"
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-2 border-transparent bg-white text-card hover:bg-white/80 focus-visible:border-primary"
                  disabled
                >
                  Follow
                </Button>
              )}
            </div>
            <h2 className="text-lg font-bold leading-6">{`${user?.firstName} ${
              user.lastName || ""
            }`}</h2>
            <p className="text-[15px] text-accent">@{user.username}</p>
          </div>
          <div className="hide-scrollbar flex h-fit w-full items-center overflow-x-scroll border-b border-border">
            {userMenu.map(
              (menu) =>
                (menu.name !== "Highlights" || user.id === currentUser?.id) && (
                  <button
                    key={menu.name}
                    className={cn(
                      "flex flex-1 justify-center px-4 text-[16px] leading-5 text-accent first:font-semibold first:text-white",
                      "hover:bg-white/[.03] focus-visible:bg-white/[.03]"
                    )}
                  >
                    <div className="relative flex justify-center px-2 py-4">
                      {menu.name}
                      {menu.href === "" ? (
                        <div className="absolute bottom-0 h-1 w-full rounded-md bg-primary" />
                      ) : null}
                    </div>
                  </button>
                )
            )}
          </div>
          <div className="flex w-full flex-col items-center">
            {userpostLoading ? (
              <div className="flex h-20 items-center justify-center">
                <LoadingSpinner size={24} />
              </div>
            ) : null}
            {!userpostLoading && posts && posts?.length !== 0 ? (
              <Feed post={posts} postLoading={userpostLoading} />
            ) : null}
          </div>
        </div>
      </PageLayout>
    </>
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
