import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { Feed, UserLayout } from "~/components/layouts";
import UserNotFound from "~/components/user-not-found";
import { getUserbyUsername } from "~/hooks/queries";
import { authClient } from "~/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/router";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = getUserbyUsername({ username });
  const { data } = authClient.useSession();
  const { push } = useRouter();
  useEffect(() => {
    if (user?.username !== data?.user.username) {
      push(`/p/${username}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, data]);
  if (!user) return <UserNotFound username={username} />;

  const { data: likes, isLoading: userLikesLoading } =
    api.profile.userLikedPosts.useQuery(
      { userId: user?.id },
      { enabled: user?.username === data?.user.username }
    );

  const UserHasnoLikes = () => {
    return (
      <div className="mx-auto my-8 flex w-full max-w-[calc(5*80px)] flex-col items-center px-8">
        <div className="w-full">
          <h2 className="mb-2 break-words text-left text-[31px] font-extrabold leading-8">
            {user.id !== data?.user.id
              ? `@${user.username} hasn’t liked any posts`
              : "You haven't liked any Tweets yet"}
          </h2>
          <p className="mb-8 break-words text-left text-[15px] leading-5 text-accent">
            {user.id !== data?.user.id
              ? "Once they do, those posts will show up here."
              : "When you like post, they will show up here."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <UserLayout
      user={user}
      title={`Post Liked by ${user?.name} (@${user?.username}) / burbir`}
      topbar={
        <p className="text-[13px] font-thin leading-4 text-accent">
          {userLikesLoading ? (
            <span className="select-none text-background">loading</span>
          ) : (
            <span>{likes?.length} Likes</span>
          )}
        </p>
      }
    >
      <div className="flex w-full flex-col items-center">
        {userLikesLoading ? (
          <div className="flex h-20 items-center justify-center">
            <LoadingSpinner size={24} />
          </div>
        ) : likes && likes?.length >= 1 ? (
          <Feed post={likes} postLoading={userLikesLoading} />
        ) : (
          <UserHasnoLikes />
        )}
      </div>
    </UserLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const username = context.params?.slug;
  if (typeof username !== "string") throw new Error("no slug");

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

export default ProfilePage;
