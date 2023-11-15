import React from "react";
import { LuSearch } from "react-icons/lu";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import { UserAvatar } from "../avatar";
import { LoadingSpinner } from "../loading";
import { useRouter } from "next/router";

const RightAside: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const { className } = props;
  const { data: peoples, isLoading } = api.profile.getUserRandomUser.useQuery();
  const { push } = useRouter();

  return (
    <aside
      className={cn(
        "sticky top-1 mr-2.5 hidden h-[100.5vh] bg-background lg:block lg:w-[290px] xl:w-[350px]",
        className
      )}
      {...props}
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
      <div className="mb-4 min-h-[15rem] rounded-2xl bg-card">
        {isLoading ? (
          <div className="flex min-h-[15rem] w-full items-center justify-center">
            <LoadingSpinner size={24} />
          </div>
        ) : (
          <>
            <h1 className="px-4 py-3">You Might Like</h1>
            <div>
              {peoples?.map((ppl) => (
                <div
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/[.03]"
                  key={ppl.username}
                  role="button"
                  onClick={() => push(`/${ppl.username}`)}
                >
                  <div className="flex flex-grow basis-10">
                    <UserAvatar
                      {...ppl}
                      className="mr-3 aspect-square h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold leading-5">{`${
                        ppl.firstName
                      } ${ppl.lastName || null}`}</span>
                      <span className="text-accent">@{ppl.username}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-2 border-transparent bg-white text-card hover:bg-white/80 focus-visible:border-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export { RightAside };
