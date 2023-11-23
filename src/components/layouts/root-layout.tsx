import { Toaster } from "react-hot-toast";
import { cn } from "~/lib/utils";
import { RightAside, MobileNav, Navbar } from ".";
import { useMediaQuery } from "~/hooks/use-media-q";

export const PageLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const showNavbar = useMediaQuery("(min-width: 570px)");

  return (
    <div className="flex w-full gap-0 max-[570px]:pb-12 xs:justify-center">
      <Navbar />
      <main className={cn("relative w-full md:w-auto", className)}>
        <div className="flex w-full flex-shrink justify-between md:w-[600px] lg:w-[920px] xl:w-[990px]">
          {children}
          <RightAside />
        </div>
      </main>
      {showNavbar ? null : <MobileNav />}
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
