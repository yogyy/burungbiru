import type { PropsWithChildren, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./layouts/navbar";
import { cn } from "~/lib/utils";
import { RightAside } from "./layouts/aside";
import { MobileNav } from "./layouts/mobile-navbar";
import { useMediaQuery } from "~/hooks/use-media-q";

export const PageLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const showNavbar = useMediaQuery("(min-width: 570px)");
  const showAside = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="max-[570px]:pb-12 flex w-full gap-0 xs:justify-center">
      {showNavbar ? <Navbar /> : <MobileNav />}
      <main className={cn("relative w-full md:w-auto", className)}>
        <div className="flex w-full flex-shrink justify-between md:w-[600px] lg:w-[920px] xl:w-[990px]">
          {children}
          {showAside ? <RightAside /> : null}
        </div>
      </main>

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
