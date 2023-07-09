import { type NextPage } from "next";
import { useUser, SignInButton } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { CreateWizzardPost } from "~/components/CreateWizzardPost";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  return (
    <div className="h-auto w-auto min-w-[670px]">
      {postLoading ? (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size={60} />
        </div>
      ) : !data ? (
        <div>Something went wrong! </div>
      ) : (
        data.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
        ))
      )}
    </div>
  );
};

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  if (!userLoaded) return <div />;

  return (
    <PageLayout className="flex-row gap-4">
      <div className="flex flex-col border-x border-border md:max-w-2xl">
        <div className="sticky top-0 h-full  w-full border-b border-border backdrop-blur-sm">
          <nav className="my-3 h-[53px] px-3 text-[20px] font-semibold">
            <h1>Beranda</h1>
          </nav>
          <div className="h-[53px]">dadad</div>
        </div>
        <div className="flex border-b border-border p-4">
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

{
  /* <Tabs defaultValue="account" className="h-[53px] w-full">
        <div className="my-3 h-[53px] px-3 text-[20px] font-semibold">
          <h1>Beranda</h1>
        </div>
          <TabsList>
            <TabsTrigger value="account">For You</TabsTrigger>
            <TabsTrigger value="password">Following</TabsTrigger>
          </TabsList>
          <div className="flex border-b border-border p-4">
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <CreateWizzardPost />}
          </div>
          <TabsContent value="account" className="">
            <Feed />
          </TabsContent>
          <TabsContent value="password">
            <p>not following anyone</p>
          </TabsContent>
        </Tabs> */
}
