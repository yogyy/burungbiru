import type { PropsWithChildren, ReactNode } from "react";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "./layouts/navbar";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import { BiDotsHorizontalRounded } from "react-icons/bi";
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
    <div
      style={openSans.style}
      className="relative flex h-auto w-full justify-start overflow-y-hidden"
    >
      <header>
        <div className="hidden w-20 place-content-end sm:w-28 md:flex md:w-32 xl:w-[400px]">
          <Navbar />
        </div>
      </header>
      <main
        className={cn(
          "relative flex h-full min-h-[110vh] w-auto flex-col border-x border-border",
          className
        )}
      >
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
};
// fixed top-0 mb-3 hidden h-full w-[68px] flex-col items-end justify-between min-[500px]:flex sm:w-[88px] xl:w-[260px]
