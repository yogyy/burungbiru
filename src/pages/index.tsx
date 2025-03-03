import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingPage } from "~/components/loading";
import { authClient } from "~/lib/auth-client";

const IndexPage = () => {
  const { push } = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    push("/home");
  }, [session]);

  if (!isPending)
    return (
      <div className="flex h-[100dvh] w-screen items-center justify-center">
        <Image
          src="/apple-touch-icon.png"
          className="grayscale"
          draggable={false}
          priority
          width={100}
          height={100}
          alt="logo"
        />
      </div>
    );

  return <LoadingPage />;
};

export default IndexPage;
