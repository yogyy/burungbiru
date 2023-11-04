import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  const { data: posts, isLoading: userpostLoading } =
    api.posts.getPostsByUserId.useQuery({
      userId: user?.id as string,
    });

  if (!posts)
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-3xl font-semibold text-red-500">User Not Found</h2>
      </div>
    );

  if (isLoading) {
    return <p>loading</p>;
  }

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
        <div className="flex w-full flex-col border-x border-border md:w-[600px]">
          <div className="sticky top-0 z-10 flex h-auto w-full items-center bg-dark/70 px-4 font-semibold backdrop-blur-md ">
            <div className="relative flex h-[53px] w-full items-center md:max-w-[600px]">
              <div className="-ml-2 w-14">
                <ButtonBack />
              </div>
              <div className="flex w-max flex-shrink flex-col justify-center">
                <h1 className="font-sans text-xl font-bold leading-6">
                  {user?.firstName + (user?.lastName ? user?.lastName : "")}
                </h1>
                <p className="text-[13px] font-thin leading-4 text-accent ">
                  {posts.length} posts
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[url('https://pbs.twimg.com/profile_banners/15240983020bg-cover relative h-auto max-h-[12.5rem] object-cover">
            <Image
              src="https://pbs.twimg.com/profile_banners/1524098302039318529/1687799380/600x200"
              alt={`banner @${user?.username}`}
            />
          </div>
          <div className="mb-3 px-4 pt-3">
            <div className="relative flex w-full flex-wrap justify-between">
              <div className="-mt-[15%] mb-3 h-auto w-1/4 min-w-[48px]">
                <Image
                  src={user?.profileImg as string}
                  alt={`${
                    user?.username ?? user?.firstName ?? "unknown"
                  }'s profile pic`}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-dark bg-dark"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-full dark:bg-background"
              >
                Edit Profile
              </Button>
            </div>
            <h2 className="text-2xl font-bold">{`@${
              user?.username ?? user?.firstName ?? "unknown"
            }`}</h2>
          </div>
          <div className="w-full border-b border-border" />
          <div className="flex w-full flex-col">
            {userpostLoading && (
              <div className="flex h-screen items-center justify-center">
                <LoadingSpinner size={60} />
              </div>
            )}
            {!userpostLoading && posts && posts?.length !== 0 ? (
              <Feed post={posts} postLoading={userpostLoading} />
            ) : (
              <div>User has not posted</div>
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
};
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingSpinner } from "~/components/loading";
import ButtonBack from "~/components/ButtonBack";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import Feed from "~/components/layouts/feed";
import { Button } from "~/components/ui/button";

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
