import { LuSearch } from "react-icons/lu";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { UserAvatar } from "../avatar";
import { LoadingSpinner } from "../loading";
import { useRouter } from "next/router";
import { FollowButton } from "../button-follow";

export const RightAside = (props: React.ComponentProps<"aside">) => {
  const { className, ...rest } = props;
  const { data: peoples, isLoading } = api.profile.getUserRandomUserDB.useQuery(
    {},
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
  const { push } = useRouter();

  return (
    <aside
      className={cn(
        "sticky top-1 mr-2.5 hidden h-[100.5vh] bg-background lg:block lg:w-[290px] xl:w-[350px]",
        className
      )}
      {...rest}
    >
      <div className="sticky top-1 z-20 mb-3 bg-background pb-1">
        <div className="group flex w-full rounded-full border bg-card text-accent focus-within:border-primary">
          <div className="flex w-10 flex-shrink items-center">
            <LuSearch
              className="h-[1.25em] min-w-[32px] pl-3 group-focus-within:text-primary"
              size={16}
            />
          </div>
          <input
            placeholder="Search"
            type="text"
            className="w-full bg-transparent p-3 text-[15px] leading-5 text-foreground outline-none"
          />
        </div>
      </div>
      <div className="mb-4 min-h-[15rem] overflow-hidden rounded-2xl bg-card">
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
                className="group relative flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-white/[.03]"
                key={ppl.username}
                onClick={() => push(`/@${ppl.username}`)}
              >
                <div className="flex w-full overflow-hidden">
                  <UserAvatar
                    imageUrl={ppl.imageUrl}
                    username={ppl.username}
                    className="mr-3 aspect-square h-10 rounded-full"
                  />
                  <div className="flex min-w-full flex-shrink flex-col">
                    <span className="text-[15px] font-bold leading-5">
                      {ppl.name}
                    </span>
                    <span className="text-accent">@{ppl.username}</span>
                  </div>
                </div>
                <FollowButton user={ppl} className="ml-3" />
              </div>
            ))}
            <button
              type="button"
              className="w-full p-4 text-left text-primary hover:bg-white/[.03]"
            >
              Show More
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
