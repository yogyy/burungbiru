import React from "react";
import ButtonBack from "~/components/ButtonBack";
import { PageLayout } from "~/components/layouts";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SEO } from "../simple-seo";

export const PostNotFound = () => {
  return (
    <>
      <SEO title="Page not found / burbir" />
      <PageLayout className="flex">
        <div className="flex h-full min-h-screen w-full max-w-[600px] flex-col border-x border-border">
          <div className="sticky top-0 z-20 flex h-[53px] w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
            <div className="w-16">
              <ButtonBack />
            </div>
            <p>Post</p>
          </div>
          <div
            className={cn(
              "relative w-full max-w-full border-border px-3 py-10 outline-none"
            )}
          >
            <div className="mt-10 flex h-auto flex-col items-center justify-center px-3 py-5">
              <p className="mb-7 break-words text-[15px] leading-5 text-accent">
                Hmm...this page doesn’t exist. Try searching for something else.
              </p>
              <Button
                disabled
                className="h-auto py-1.5 text-base font-bold leading-5"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};
