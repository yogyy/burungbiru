import type { PropsWithChildren, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./layouts/navbar";
import { cn } from "~/lib/utils";

export const PageLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex w-full gap-0 xs:justify-center">
      <header className="relative hidden xs:flex">
        <Navbar />
      </header>
      <main className={cn("relative w-full md:w-auto", className)}>
        <div className="flex w-full flex-shrink justify-between md:w-[600px] lg:w-[920px] xl:w-[990px]">
          {children}
          <aside className="sticky top-5 mr-2.5 hidden h-[100.5vh] lg:block lg:w-[290px] xl:w-[350px]">
            <div className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas,
              aperiam placeat, in quisquam nisi et id accusamus voluptatibus
              perferendis a voluptate officiis veniam. Quos vero, commodi
              nesciunt blanditiis nulla ut maxime.
            </div>
          </aside>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
};
// fixed top-0 mb-3 hidden h-full w-[68px] flex-col items-end justify-between min-[500px]:flex sm:w-[88px] xl:w-[260px]
