import React from "react";
import { ButtonBack } from "../button-back";
import { PageLayout } from "./root-layout";
import { cn } from "~/lib/utils";
import { userMenu } from "~/constant";
import { api } from "~/utils/api";
import { ImageModal } from "../modal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SEO } from "../simple-seo";
import { Badge } from "../ui/badge";
import { UserDetail } from "~/types";
import { FollowUser } from "../follow-user-sticky";
import { UserDetails } from "./user-details";
import { authClient } from "~/lib/auth-client";

interface UserLayoutProps extends UserDetail {
  children: React.ReactNode;
  topbar?: React.ReactNode;
  title: string;
}

export const UserLayout = (props: UserLayoutProps) => {
  const { children, topbar, user, title } = props;
  const { data } = authClient.useSession();
  const pathname = usePathname();
  const { data: posts, isLoading: userpostLoading } =
    api.profile.userPosts.useQuery({ userId: user?.id });

  const ScrollToTop = () => {
    if (window !== undefined) {
      window.scrollTo(0, 0);
    } else {
      null;
    }
  };

  return (
    <>
      <SEO title={title} />
      <PageLayout className="flex">
        <div className="flex h-full w-full max-w-[600px] flex-col border-x border-border">
          <div
            className="sticky top-0 z-[25] flex h-auto w-full items-center scroll-smooth bg-background/[.65] px-4 font-semibold backdrop-blur-md hover:cursor-pointer"
            onClick={ScrollToTop}
          >
            <div className="relative flex h-[53px] w-full items-center md:max-w-[600px]">
              <div className="-ml-2 w-14">
                <ButtonBack />
              </div>

              <div className="flex w-max flex-shrink flex-col justify-center">
                <h1 className="inline-flex h-auto items-end font-sans text-lg font-bold leading-6">
                  {user.name}
                  <Badge variant={user.type} />
                </h1>
                {topbar ? (
                  topbar
                ) : (
                  <p className="text-[13px] font-thin leading-4 text-accent">
                    {userpostLoading ? (
                      <span className="select-none text-background">
                        loading
                      </span>
                    ) : (
                      <span>{posts?.posts.length} posts</span>
                    )}
                  </p>
                )}
              </div>
              <FollowUser user={user} />
            </div>
          </div>
          <div className="relative aspect-[3/1] w-full overflow-hidden">
            {user.banner ? (
              <ImageModal
                alt={`${user?.username}'s banner`}
                src={user.banner}
                width="600"
                height="200"
                priority
                className="h-full max-h-[12.5rem] w-full bg-no-repeat object-cover"
              />
            ) : (
              <div className="h-full w-full bg-border"></div>
            )}
          </div>
          <UserDetails user={user} />
          <div className="hide-scrollbar flex h-fit w-full items-center overflow-x-scroll border-b border-border">
            {userMenu.map(
              (menu) =>
                (menu.name !== "Likes" || user.id === data?.user.id) && (
                  <Link
                    key={menu.name}
                    href={`/p/${user.username}${menu.href}`}
                    className={cn(
                      "flex flex-1 justify-center px-4 text-[16px] leading-5 text-accent",
                      "-outline-offset-1 hover:bg-white/[.03] focus-visible:bg-white/[.03] focus-visible:outline-2",
                      user.username + menu.href === pathname.substring(3) &&
                        "font-semibold text-white"
                    )}
                  >
                    <div className="relative flex justify-center px-2 py-4">
                      {menu.name}
                      {`${user.username}${menu.href}` ===
                      pathname.substring(3) ? (
                        <div className="absolute bottom-0 h-1 w-full rounded-md bg-primary" />
                      ) : null}
                    </div>
                  </Link>
                )
            )}
          </div>
          <div className="flex min-h-[40dvh] w-full flex-col items-center">
            {children}
          </div>
        </div>
      </PageLayout>
    </>
  );
};
