import type { PropsWithChildren, ReactNode } from "react";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "./layouts/navbar";
import { cn } from "~/lib/utils";

const openSans = Open_Sans({ subsets: ["latin"] });

export const PageLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div style={openSans.style} className="flex">
      <header className="relative hidden w-20 place-content-end sm:flex md:w-[260px] lg:w-[400px] xl:w-[500px]">
        <Navbar />
      </header>
      <main className={cn("relative flex h-full w-full flex-col", className)}>
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
};
// fixed top-0 mb-3 hidden h-full w-[68px] flex-col items-end justify-between min-[500px]:flex sm:w-[88px] xl:w-[260px]
