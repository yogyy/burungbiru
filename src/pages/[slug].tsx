import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  // if (isLoading) return <LoadingPage />;

  return (
    <div className="flex w-full flex-col">
      {isLoading && (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size={60} />
        </div>
      )}
      {!isLoading && data && data?.length !== 0 ? (
        data.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
        ))
      ) : (
        <div>User has not posted</div>
      )}
    </div>
  );
};

// ... timestamp

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!data)
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-semibold text-red-500">User Not Found</h1>
      </div>
    );

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout className="">
        <div className="flex w-full flex-col border-x border-border md:w-[42rem]">
          <div className="sticky top-0 z-10 flex h-14 w-full items-center bg-dark/70 px-4 font-semibold backdrop-blur-md md:max-w-2xl">
            <div className="w-16">
              <ButtonBack />
            </div>
            <p>{data.firstName + (data.lastName ? data.lastName : "")}</p>
          </div>
          <div className="relative h-36 bg-zinc-600">
            <Image
              src={data.profileImg}
              alt={`${
                data.username ?? data.firstName ?? "unknown"
              }'s profile pic`}
              width={128}
              height={128}
              className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-dark bg-dark"
            />
          </div>
          <div className="h-[64px]"></div>
          <div className="p-4 text-2xl font-bold">{`@${
            data.username ?? data.firstName ?? "unknown"
          }`}</div>
          <div className="w-full border-b border-border" />
          <ProfileFeed userId={data.id} />
          <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  );
};
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { PostView } from "~/components/postView";
import ButtonBack from "~/components/ButtonBack";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

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

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
