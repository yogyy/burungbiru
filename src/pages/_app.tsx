import { AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { SEO } from "~/components/simple-seo";
import Script from "next/script";
import { env } from "~/env.mjs";
import { Toaster } from "sonner";
import { LoadingSpinner } from "~/components/loading";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const component = getLayout(<Component {...pageProps} />);
  return (
    <>
      {process.env.NODE_ENV === "production" ? (
        <Script defer src="/script.analytics.js" data-website-id={env.NEXT_PUBLIC_UMAMI_ID} />
      ) : (
        <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      )}
      <SEO />
      {component}
      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--foreground))",
            border: "none",
            width: "fit-content",
            padding: "12px 14px",
          },
        }}
        icons={{ loading: <LoadingSpinner className="fill-white" /> }}
      />
    </>
  );
};

export default api.withTRPC(MyApp);
