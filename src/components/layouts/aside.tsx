import { SignInButton, clerkClient, useUser } from "@clerk/nextjs";
import React from "react";
import { LuSearch } from "react-icons/lu";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { Button } from "../ui/button";

const RightAside: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const { className } = props;

  const { data: peoples } = api.profile.getUserRandomUser.useQuery();
  const { isSignedIn } = useUser();

  return (
    <aside
      className={cn(
        "sticky top-1 mr-2.5 hidden h-[100.5vh] lg:block lg:w-[290px] xl:w-[350px]",
        className
      )}
      {...props}
    >
      <div className="group sticky top-1 mb-3 flex w-full rounded-full border bg-card text-accent focus-within:border-primary">
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
      <div className="h-14" />
      <div className="-mt-8 mb-4 min-h-[15rem] rounded-2xl bg-card">
        <h1 className="px-4 py-3">You Might Like</h1>
        <div className="">
          {!isSignedIn ? (
            <Button asChild>
              <SignInButton mode="modal" />
            </Button>
          ) : (
            peoples?.map((ppl) => (
              <div
                className="flex justify-between px-4 py-3"
                key={ppl.username}
              >
                <div className="flex flex-grow basis-10">
                  <img
                    src={ppl.profileImg}
                    width={40}
                    height={40}
                    alt=""
                    className="mr-3 aspect-square h-10"
                  />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold leading-5">{`${
                      ppl.firstName
                    } ${ppl.lastName || null}`}</span>
                    <span className="text-accent">@{ppl.username}</span>
                  </div>
                </div>
                <Button variant="outline">Follow</Button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export { RightAside };
