import React from "react";
import { PageLayout } from "./layouts";
import { ButtonBack } from "./button-back";
import { cn } from "~/lib/utils";
import { SEO } from "./simple-seo";

const UserNotFound = ({ username }: { username: string }) => {
  return (
    <>
      <SEO title="Profile / burbir" />
      <PageLayout>
        <div className="flex h-full w-full max-w-[600px] flex-col border-x border-border">
          <div className="sticky top-0 z-20 flex h-auto w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
            <div className="relative flex h-[53px] w-full items-center md:max-w-[600px]">
              <div className="-ml-2 w-14">
                <ButtonBack />
              </div>
              <div className="flex w-max flex-shrink flex-col justify-center">
                <h1 className="font-sans text-lg font-bold leading-6">Profile</h1>
              </div>
            </div>
          </div>
          <div className="relative aspect-[3/1] w-full overflow-hidden">
            <div className="h-full max-h-[12.5rem] w-full bg-[rgb(51,54,57)] bg-no-repeat object-cover" />
          </div>
          <div className="px-4 pb-3 pt-3">
            <div className="relative flex w-full flex-wrap justify-between">
              <div className="-mt-[15%] mb-3 w-1/4 min-w-[48px]">
                <div
                  className={cn(
                    "aspect-square w-full rounded-full border-red-700 bg-background object-cover",
                    "relative flex max-h-[140px] max-w-[140px] items-center justify-center overflow-hidden p-1"
                  )}
                >
                  <div className="h-full w-full rounded-full bg-[rgb(22,24,28)]" />
                </div>
              </div>
            </div>
            <h2 className="text-[20px] font-extrabold leading-6">{`@${username} `}</h2>
          </div>
          <div className="mx-auto my-8 flex w-full max-w-[calc(5*80px)] flex-col items-center px-5 py-8">
            <h1 className="mb-2 w-full break-words text-left text-[31px] font-extrabold leading-9">
              This account doesn’t exist
            </h1>
            <p className="mb-7 w-full break-words text-left text-[15px] leading-5 text-accent">
              Try searching for another.
            </p>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default UserNotFound;
