import { RightAside } from "./aside";
import { Navbar } from "../navbar";
import { MobileNav } from "../navbar/mobile-navbar";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/router";

type PageLayoutProps = Pick<React.HTMLAttributes<HTMLElement>, "children">;
export const PageLayout = ({ children }: PageLayoutProps) => {
  const { data } = authClient.useSession();
  const { push } = useRouter();

  if (!data && typeof window !== "undefined") {
    push("/auth/sign-in");
  }

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
