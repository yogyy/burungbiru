import { Navbar } from "~/components/navbar";
import { SEO } from "~/components/simple-seo";
import { Button } from "~/components/ui/button";
import { featureNotReady } from "~/lib/utils";

export default function Custom404() {
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
                      Hmm...this page doesn’t exist. Try searching for something
                      else.
                    </p>
                    <Button onClick={searching} className="h-9">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
