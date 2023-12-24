import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export const SEO: React.FC<{ title?: string }> = ({ title = "burbir" }) => {
  const { asPath } = useRouter();
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="twitter clone build with t3 stack" />

      <meta property="og:url" content="https://burungbiru.vercel.app" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="burbir" />
      <meta
        property="og:description"
        content="twitter clone build with t3 stack"
      />
      <meta
        property="og:image"
        content="https://res.cloudinary.com/dpegakmzh/image/upload/v1703434491/burbir/app/twitter-t3_yncfub.jpg"
      />

      <link rel="canonical" href={`https://burungbiru.vercel.app${asPath}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="burungbiru.vercel.app" />
      <meta property="twitter:url" content="https://burungbiru.vercel.app" />
      <meta name="twitter:title" content="burbir" />
      <meta
        name="twitter:description"
        content="twitter clone build with t3 stack"
      />
      <meta
        name="twitter:image"
        content="https://res.cloudinary.com/dpegakmzh/image/upload/v1703434491/burbir/app/twitter-t3_yncfub.jpg"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
