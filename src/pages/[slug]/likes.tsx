import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";

import { PageLayout, Feed, UserLayout } from "~/components/layouts";
import UserNotFound from "~/components/user-not-found";

type likedProps = RouterOutputs["profile"]["userLikedPosts"];

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!user) return <UserNotFound username={username} />;

  const { data: likes, isLoading: userLikeLoading } =
    api.profile.userLikedPosts.useQuery({
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
            {userLikeLoading ? ".." : likes?.length} likes
          </p>
        </div>
      }
    >
      {/* <pre className="w-full overflow-x-scroll">
        {JSON.stringify(likes, null, 2)}
      </pre> */}
      <div className="flex w-full flex-col items-center">
        {userLikeLoading ? (
          <div className="flex h-20 items-center justify-center">
            <LoadingSpinner size={24} />
          </div>
        ) : null}
        {!userLikeLoading && likes && likes?.length !== 0 ? (
          <Feed post={likes} postLoading={userLikeLoading} />
        ) : null}
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

export default ProfilePage;
