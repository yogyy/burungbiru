import type { PropsWithChildren, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./layouts/navbar";
import { cn } from "~/lib/utils";
import { RightAside } from "./layouts/aside";
import { MobileNav } from "./layouts/mobile-navbar";

export const PageLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex w-full gap-0 max-[555px]:pb-12 xs:justify-center">
      <header className="relative hidden min-[555px]:flex">
        <Navbar />
      </header>
      <main className={cn("relative w-full md:w-auto", className)}>
        <div className="flex w-full flex-shrink justify-between md:w-[600px] lg:w-[920px] xl:w-[990px]">
          {children}
          <RightAside />
        </div>
      </main>
      <MobileNav />
      <Toaster
        position="top-right"
        toastOptions={{
          position: "bottom-center",
          style: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--foreground))",
          },
          success: {
            icon: null,
          },
          loading: {
            position: "top-center",
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
