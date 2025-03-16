import { RightAside } from "./aside";
import { Navbar } from "../navbar";
import { MobileNav } from "../navbar/mobile-navbar";

interface PageLayoutProps extends React.HTMLAttributes<HTMLElement> {}
export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex w-full gap-0 max-[570px]:pb-12 xs:justify-center">
      <Navbar />
      <main className="relative flex w-full md:w-auto">
        <div className="flex w-full flex-shrink justify-between md:w-[600px] lg:w-[920px] xl:w-[990px]">
          {children}
          <RightAside />
        </div>
      </main>
      <MobileNav />
    </div>
  );
};
