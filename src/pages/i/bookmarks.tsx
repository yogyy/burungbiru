import { ButtonBack } from "~/components/button-back";
import { Feed, PageLayout } from "~/components/layouts";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { SEO } from "~/components/simple-seo";
import { authClient } from "~/lib/auth-client";
import { api } from "~/utils/api";

const Bookmarks = () => {
  const { data, isPending } = authClient.useSession();

  const { data: bookmarks, isLoading: userBookmarkLoading } =
    api.profile.userBookmarkedPosts.useQuery(
      { userId: data?.user.id || "" },
      { enabled: !isPending }
    );

  return (
    <>
      <SEO title={`Bookmarks / burbir`} />
      <PageLayout className="flex">
        <div className="flex h-full min-h-screen w-full max-w-[600px] flex-col border-x border-border">
          <div className="sticky top-0 z-[25] flex h-auto w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
            <div className="relative flex h-[53px] w-full items-center md:max-w-[600px]">
              <div className="-ml-2 block w-14 min-[570px]:hidden">
                <ButtonBack />
              </div>
              <div className="flex w-max flex-shrink flex-col justify-center">
                <h1 className="font-sans text-xl font-bold leading-6">
                  Bookmarks
                </h1>
                <p className="text-[14px] font-thin leading-4 text-accent">
                  @{data?.user.username}
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center">
            {userBookmarkLoading && (
              <div className="flex h-20 items-center justify-center">
                <LoadingSpinner size={24} />
              </div>
            )}
            {!userBookmarkLoading && bookmarks && bookmarks?.length !== 0 && (
              <Feed post={bookmarks} postLoading={userBookmarkLoading} />
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Bookmarks;
