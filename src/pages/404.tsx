import Link from "next/link";
import { Navbar } from "~/components/navbar";
import { SEO } from "~/components/simple-seo";
import { Button, buttonVariants } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { cn, featureNotReady } from "~/lib/utils";

export default function Custom404() {
  const { data } = authClient.useSession();
  function searching() {
    return featureNotReady("searching-page");
  }
  return (
    <>
      <SEO title="Page not found / burbir" />
      <div className="flex w-full gap-0 max-[570px]:pb-12 xs:justify-center">
        <Navbar />
        <main className="relative w-full md:w-auto">
          <div className="flex w-full flex-shrink justify-between md:w-[600px] lg:w-[920px] xl:w-[990px]">
            <div className="mx-auto w-full max-w-xl">
              <div className="px-3 py-10 text-center">
                <div className="mt-10">
                  <div className="px-3 py-5">
                    <p className="mb-7 break-words text-center text-accent ">
                      Hmm...this page doesn’t exist. Try searching for something else.
                    </p>
                    <Button onClick={searching} className="h-9">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!data && (
            <div className="fixed bottom-0 left-0 flex w-full justify-center bg-primary">
              <div className="my-3 flex w-full flex-col items-center justify-between md:w-[600px] md:flex-row lg:w-[920px] xl:w-[990px]">
                <div className="hidden flex-col md:flex">
                  <p className="text-2xl font-bold leading-7">
                    Don&apos;t miss what&apos;s happening
                  </p>{" "}
                  <p className="text-base leading-5">The people at Burbir knew first.</p>
                </div>
                <div className="flex w-full gap-3 px-4 md:w-fit">
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-9 w-auto flex-grow md:flex-shrink-0"
                    )}
                    href="/auth/sign-in"
                  >
                    Sign-in
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "h-9 w-auto flex-grow md:flex-shrink-0"
                    )}
                    href="/auth/sign-in"
                  >
                    Sign-up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
