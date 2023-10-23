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
    <body className="flex justify-center">
      <header className="relative place-content-end">
        <Navbar />
      </header>
      <main className={cn("relative flex", className)}>
        {children}
        <aside className="sticky top-0 hidden h-screen lg:block">
          <div className="mr-[0.625rem] h-full w-[260px] bg-secondary lg:w-[350px]">
            ddadd
          </div>
        </aside>
      </main>
      <Toaster position="top-right" />
    </body>
  );
};
// fixed top-0 mb-3 hidden h-full w-[68px] flex-col items-end justify-between min-[500px]:flex sm:w-[88px] xl:w-[260px]
