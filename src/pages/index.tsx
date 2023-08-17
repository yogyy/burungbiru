import { type NextPage } from "next";
import { useUser, SignInButton } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { CreateWizzardPost } from "~/components/CreateWizzardPost";
import { LuTwitter } from "react-icons/lu";

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  return (
    <div className="h-auto w-full">
      {postLoading && (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size={60} />
        </div>
      )}
      {!data && <div>Something went wrong! </div>}
      {data &&
        data.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
        ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  if (!userLoaded)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LuTwitter size={100} className="fill-slate-300 stroke-slate-300" />
      </div>
    );
  return (
    <PageLayout className="">
      <div className="flex w-full flex-col border-x border-border md:w-[42rem]">
        <div className="sticky top-0 z-10 h-full w-full min-w-[300px] border-b border-border bg-dark/70 backdrop-blur-sm">
          <nav className="flex h-[53px] items-center px-3 text-[20px] font-semibold">
            <h1>Beranda</h1>
          </nav>
          <div className="flex h-[53px] items-center font-semibold">
            <div className="relative flex h-full w-full flex-1 items-center justify-center hover:cursor-pointer hover:bg-white/10">
              For You
              <span className="absolute bottom-0 h-1 w-1/3 rounded-md bg-[#1D9BF0]" />
            </div>
            <div className="relative flex h-full w-full flex-1 items-center justify-center hover:cursor-pointer hover:bg-white/10">
              For You
            </div>
          </div>
        </div>
        <div className="bg-blue-400"></div>
        <div className="hidden border-b border-border p-4 min-[500px]:flex">
          {!isSignedIn && <SignInButton />}
          {isSignedIn && <CreateWizzardPost />}
        </div>
        <Feed />
      </div>
      {/* <section className="hidden w-[275px] lg:block">ddadd</section> */}
    </PageLayout>
  );
};

export default Home;
