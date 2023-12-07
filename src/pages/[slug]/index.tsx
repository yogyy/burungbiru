import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { Feed, UserLayout } from "~/components/layouts";
import UserNotFound from "~/components/user-not-found";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!user) return <UserNotFound username={username} />;

  const { data: posts, isLoading: userpostLoading } =
    api.profile.userPosts.useQuery({
      userId: user?.id,
    });

  return (
    <UserLayout user={user}>
      {userpostLoading && (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      )}
      {!userpostLoading && posts && posts?.length !== 0 && (
        <Feed post={posts} postLoading={userpostLoading} />
      )}
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
