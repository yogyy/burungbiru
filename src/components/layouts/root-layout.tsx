import { RightAside } from "./aside";
import { Navbar } from "../navbar";
import { MobileNav } from "../navbar/mobile-navbar";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

type PageLayoutProps = Pick<React.HTMLAttributes<HTMLElement>, "children">;
export const PageLayout = ({ children }: PageLayoutProps) => {
  const { data, isPending } = authClient.useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (!isPending && !data) {
      push("/auth/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, data]);

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
