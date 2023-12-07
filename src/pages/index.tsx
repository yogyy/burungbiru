import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LogoIcon } from "~/components/icons";
import { BurgerMenu, PageLayout, Feed } from "~/components/layouts";
import { useMediaQuery } from "~/hooks/use-media-q";
import dynamic from "next/dynamic";

const LazyForm = dynamic(() => import("~/components/form"));

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { data, isLoading: postLoading } = api.post.timeline.useQuery();
  const showBurgerMenu = useMediaQuery("(max-width: 570px)");

  if (!userLoaded)
    return (
      <div className="flex h-[100dvh] w-screen items-center justify-center">
        <LogoIcon size={80} className="text-white sm:text-white/10" />
      </div>
    );

  return (
    <PageLayout className="flex">
      <div className="flex w-full max-w-[600px] flex-shrink flex-col border-x border-border">
        {showBurgerMenu && <BurgerMenu isSignedIn={isSignedIn} user={user} />}
        <div className="sticky top-0 z-[25] h-auto w-full border-b border-border bg-background/[.65] backdrop-blur-md">
          <div className="flex h-[53px] items-center">
            <div className="relative  flex h-full w-full flex-1 items-center justify-center px-4 font-semibold hover:cursor-pointer">
              <div className="relative flex h-full w-fit items-center">
                For You
                <span className="absolute -left-0.5 bottom-0 h-1 w-[108%] rounded-md bg-primary" />
              </div>
            </div>
            <div className="relative flex h-full w-full flex-1 items-center justify-center px-4 font-medium text-accent hover:cursor-pointer">
              Following
            </div>
          </div>
        </div>

        {isSignedIn && !showBurgerMenu && (
          <div className="hidden border-b border-border min-[570px]:flex">
            <LazyForm />
          </div>
        )}
        {<Feed post={data} postLoading={postLoading} />}
      </div>
    </PageLayout>
  );
};

export default Home;
