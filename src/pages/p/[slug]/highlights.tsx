import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { buttonVariants } from "~/components/ui/button";
import UserNotFound from "~/components/user-not-found";
import { api } from "~/utils/api";
import { cn, featureNotReady } from "~/lib/utils";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { authClient } from "~/lib/auth-client";
import { ProfileContext } from "~/context";
import { UserLayout } from "~/components/layouts/user-layout";

const ProfilePageReplies: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });
  const { data } = authClient.useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (username !== data?.user.username) {
      push(`/p/${username}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  if (!user) return <UserNotFound username={username} />;

  return (
    <ProfileContext.Provider value={user}>
      <UserLayout>
        <div className="mx-auto my-8 flex w-full max-w-[calc(5*80px)] flex-col items-center px-8">
          <div className="w-full">
            <h2 className="mb-2 break-words text-left text-[31px] font-extrabold leading-8">
              Highlight on your profile
            </h2>
            <p className="mb-8 break-words text-left text-[15px] leading-5 text-accent">
              You must be subscribed to Premium to highlight posts on your profile.
            </p>
            <button
              onClick={() => featureNotReady("switch-to-pro", "This feature won't be implemented")}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "min-h-[52px] max-w-fit flex-1 flex-grow whitespace-nowrap break-words px-8 text-base font-bold leading-5"
              )}
            >
              Subscribe to Premium
            </button>
          </div>
        </div>
      </UserLayout>
    </ProfileContext.Provider>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const username = context.params?.slug;
  if (typeof username !== "string") throw new Error("no slug");

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

export default ProfilePageReplies;
