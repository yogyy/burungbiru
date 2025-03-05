import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { SEO } from "~/components/simple-seo";
import Script from "next/script";
import { env } from "~/env.mjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      {/* <Script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
      {process.env.NODE_ENV === "production" && (
        <Script
          defer
          src="/script.analytics.js"
          data-website-id={env.NEXT_PUBLIC_UMAMI_ID}
        />
      )}
      <SEO />
      <Component {...pageProps} />
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
    </>
  );
};

export default api.withTRPC(MyApp);
