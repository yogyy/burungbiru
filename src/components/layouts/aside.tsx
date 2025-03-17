import { api } from "~/utils/api";
import { UserAvatar } from "../avatar";
import { LoadingSpinner } from "../loading";
import { useRouter } from "next/router";
import { FollowButton } from "../button-follow";
import Footer from "./footer";
import { Search } from "../icons";

export const RightAside = () => {
  const { data: peoples, isLoading } = api.profile.getUserRandomUser.useQuery(
    {},
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
  const { push } = useRouter();

  return (
    <aside className="sticky top-1 mr-2.5 hidden h-fit bg-background lg:block lg:w-[290px] xl:w-[350px]">
      <div className="sticky top-1 z-20 mb-3 bg-background pb-1">
        <div className="group flex w-full overflow-hidden rounded-full border bg-background text-accent focus-within:border-primary">
          <div className="flex w-10 flex-shrink items-center">
            <Search className="h-[1.25em] min-w-[32px] pl-3 group-focus-within:text-primary" />
          </div>
          <input
            placeholder="Search"
            type="text"
            className="w-full bg-background p-3 text-[15px] leading-5 text-foreground outline-none"
          />
        </div>
      </div>
      <div className="mb-3 min-h-[15rem] w-full overflow-hidden rounded-2xl border bg-background">
        {isLoading ? (
          <div className="flex min-h-[15rem] w-full items-center justify-center">
            <LoadingSpinner size={24} />
          </div>
        ) : (
          <>
            <h1 className="break-words px-4 py-3 text-xl font-extrabold leading-6">
              Who to follow
            </h1>
            {peoples?.map((ppl) => (
              <div
                className="group relative flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-white/[.03] focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-primary"
                key={ppl.username}
                tabIndex={0}
                onClick={() => push(`/p/${ppl.username}`)}
              >
                <div className="flex w-full overflow-hidden">
                  <UserAvatar
                    tabIndex={-1}
                    image={ppl.image}
                    username={ppl.username}
                    className="mr-3 aspect-square h-10 rounded-full"
                  />
                  <div className="flex min-w-full flex-shrink flex-col">
                    <span className="text-[15px] font-bold leading-5">{ppl.name}</span>
                    <span className="text-accent">@{ppl.username}</span>
                  </div>
                </div>
                <FollowButton userId={ppl.id} className="ml-3" />
              </div>
            ))}
            <button
              type="button"
              className="w-full rounded-bl-2xl rounded-br-2xl p-4 text-left text-primary hover:bg-white/[.03]"
            >
              Show More
            </button>
          </>
        )}
      </div>
      <Footer />
    </aside>
  );
};
