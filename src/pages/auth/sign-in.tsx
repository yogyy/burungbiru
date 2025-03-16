import { fromNodeHeaders } from "better-auth/node";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { authClient } from "~/lib/auth-client";

type Provider = "google" | "github";

const SignInPage = () => {
  const signIn = async (provider: Provider) => {
    const data = await authClient.signIn.social({
      provider,
      callbackURL: "/home",
      newUserCallbackURL: "/auth/set-username",
    });

    return data;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-white">Welcome to Burbir</h1>
        <p className="text-neutral-400">Sign in below</p>
      </div>
      <div className="w-full max-w-xs space-y-6 md:max-w-sm">
        <Button
          onClick={() => signIn("google")}
          className="hover:text-accent-foreground h-10 w-full gap-2 whitespace-nowrap rounded-md border border-neutral-700 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-lg md:h-14 md:text-lg [&_svg]:shrink-0"
        >
          <svg
            className="mr-3 h-4 w-4 md:h-6 md:w-6"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            ></path>
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            ></path>
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            ></path>
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            ></path>
          </svg>
          Continue with Google
        </Button>
        <Button
          onClick={() => signIn("github")}
          className="hover:text-accent-foreground h-10 w-full gap-2 whitespace-nowrap rounded-md border border-neutral-700 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-lg md:h-14 md:text-lg [&_svg]:shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3 h-4 w-4 md:h-6 md:w-6"
            fill="#fff"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Continue with Github
        </Button>
      </div>
      <div className="mt-6 space-y-4 text-center text-sm text-neutral-500">
        <p>
          By continuing, you agree to our&nbsp;
          <Link href="/support/terms-of-service" className="text-neutral-400 hover:text-white">
            Terms of Service
          </Link>
          &nbsp; and&nbsp;
          <Link href="/support/privacy-policy" className="text-neutral-400 hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(context.req.headers),
  });

  if (session) {
    return { redirect: { destination: "/home", permanent: false } };
  }

  return { props: { hello: "world" } };
}
