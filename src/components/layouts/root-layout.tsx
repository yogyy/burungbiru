import { useMediaQuery } from "usehooks-ts";
import { cn } from "~/lib/utils";
import { RightAside } from ".";
import { Navbar } from "../navbar";
import { MobileNav } from "../navbar/mobile-navbar";

interface PageLayoutProps extends React.HTMLAttributes<HTMLElement> {}
export const PageLayout = ({ children, className }: PageLayoutProps) => {
  const showNavbar = useMediaQuery("(max-width: 570px)");

  return (
    <div className="flex w-full gap-0 max-[570px]:pb-12 xs:justify-center">
      <Navbar />
      <main className={cn("relative w-full md:w-auto", className)}>
        <div className="flex w-full flex-shrink justify-between md:w-[600px] lg:w-[920px] xl:w-[990px]">
          {children}
          <RightAside />
        </div>
      </main>
      {showNavbar && <MobileNav />}
    </div>
  );
};
