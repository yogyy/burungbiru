import { type AppType } from "next/app";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { SEO } from "~/components/simple-seo";
import { dark } from "@clerk/themes";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#1E9CF0",
          colorBackground: "#010100",
        },
        elements: {
          card: "border border-primary",
        },
      }}
    >
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
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
