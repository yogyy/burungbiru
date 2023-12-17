import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { Feed, UserLayout } from "~/components/layouts";
import UserNotFound from "~/components/user-not-found";
import { useUser } from "@clerk/nextjs";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsernameDB.useQuery({
    username,
  });
  const { user: currentUser, isLoaded } = useUser();
  if (!user) return <UserNotFound username={username} />;

  const { data: media, isLoading: userMediaLoading } =
    api.profile.userPostwithMedia.useQuery({
      userId: user?.id,
    });

  const UserHasNoMedia = () => {
    return (
      <div className="mx-auto my-8 flex w-full max-w-[calc(5*80px)] flex-col items-center px-8">
        <div className="w-full">
          <h2 className="mb-2 break-words text-left text-[31px] font-extrabold leading-8">
            {user.id !== currentUser?.id
              ? `@${user.username} hasn’t posted media`
              : "Lights, camera … attachments!"}
          </h2>
          <p className="mb-8 break-words text-left text-[15px] leading-5 text-accent">
            {user.id !== currentUser?.id
              ? "Once they do, those posts will show up here."
              : "When you post photos or videos, they will show up here."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <UserLayout
      user={user}
      topbar={
        <div className="flex w-max flex-shrink flex-col justify-center">
          <h1 className="font-sans text-lg font-bold leading-6">{user.name}</h1>
          <p className="text-[13px] font-thin leading-4 text-accent">
            {userMediaLoading ? (
              <span className="select-none text-background">loading</span>
            ) : (
              <span>{media?.length} Photos & videos</span>
            )}
          </p>
        </div>
      }
    >
      {userMediaLoading ? (
        <div className="flex h-20 items-center justify-center">
          <LoadingSpinner size={24} />
        </div>
      ) : media && media?.length >= 1 ? (
        <Feed post={media} postLoading={userMediaLoading} />
      ) : (
        <UserHasNoMedia />
      )}
    </UserLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

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
