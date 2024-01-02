import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React from "react";
import { LogoIcon } from "~/components/icons";
import { LoadingPage } from "~/components/loading";

const IndexPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { push } = useRouter();
  React.useEffect(() => {
    push("/home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  if (!isLoaded)
    return (
      <div className="flex h-[100dvh] w-screen items-center justify-center">
        <LogoIcon size={80} className="text-white" />
      </div>
    );

  return (
    <React.Fragment>
      <SignedIn>
        <LoadingPage />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </React.Fragment>
  );
};

export default IndexPage;
