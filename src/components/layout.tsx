import type { PropsWithChildren, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./layouts/navbar";
import { cn } from "~/lib/utils";
import { RightAside } from "./layouts/aside";

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
          <RightAside />
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          position: "bottom-center",
          icon: null,
          style: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--foreground))",
          },
          error: {
            style: {
              backgroundColor: "hsl(var(--desctructive) / .9)",
            },
            position: "top-center",
          },
        }}
      />
    </div>
  );
};
// fixed top-0 mb-3 hidden h-full w-[68px] flex-col items-end justify-between min-[500px]:flex sm:w-[88px] xl:w-[260px]
