import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import React from "react";
import { LogoIcon } from "~/components/icons";
import { LoadingPage } from "~/components/loading";

const IndexPage = () => {
  const { isLoaded } = useUser();

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  if (userId) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
