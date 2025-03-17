/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["images.clerk.dev", "avatars.githubusercontent.com", "lh3.googleusercontent.com"],
    unoptimized: true,
  },

  i18n: { locales: ["en"], defaultLocale: "en" },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  swcMinify: true,

  async rewrites() {
    return [
      {
        source: "/script.analytics.js",
        destination: "https://cloud.umami.is/script.js",
      },
    ];
  },
};
export default config;
