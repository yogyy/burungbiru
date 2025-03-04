import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { authClient } from "~/lib/auth-client";
import { api } from "~/utils/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { auth } from "~/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { LoadingSpinner } from "~/components/loading";
import { useRouter } from "next/router";

const usernameSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username can only contain letters, numbers, and underscores (_).",
    })
    .min(4, { message: "Username must be at least 4 characters." })
    .max(20),
});

function LucideX() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className="h-6 w-6 text-red-700"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      ></path>
    </svg>
  );
}

function LucideCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className="h-6 w-6 text-green-500"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 6L9 17l-5-5"
      ></path>
    </svg>
  );
}

function UsernameInformation() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="group cursor-default" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            className="text-accent group-hover:text-primary"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              color="currentColor"
            >
              <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
              <path d="M12.242 17v-5c0-.471 0-.707-.146-.854c-.147-.146-.382-.146-.854-.146m.75-3h.009" />
            </g>
          </svg>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="flex flex-col border-secondary bg-background p-2 text-xs font-light text-white/70"
        >
          <span>You can change your username only once.</span> After setting it,
          the username cannot be modified again.
          <span>Choose wisely!</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const SetUsername = ({
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
  });

  const { push } = useRouter();
  const userInput = form.watch("username");
  const findUser = api.profile.getUserByUsernameMutate.useMutation();

  async function onSubmit({ username }: z.infer<typeof usernameSchema>) {
    await findUser.mutateAsync({ username }).then(async (res) => {
      if (res === null) {
        await authClient
          .updateUser({ username, usernameSet: true })
          .then(() => push("/home"));
      }
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-xl flex-col justify-end space-y-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col">
                  <FormLabel className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                    Choose your username
                    <UsernameInformation />
                  </FormLabel>
                  <p className="text-sm text-accent">
                    your current username is
                    <span className="italic"> @{username}</span>
                  </p>
                </div>
                <div className="group relative flex w-full items-center rounded-lg border-2 border-secondary bg-secondary px-3 focus-within:border-primary hover:border-border hover:focus-within:border-primary">
                  <div className="pr-1">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      className="pointer-events-none flex-shrink-0 text-[rgb(201,210,219)] group-focus-within:text-primary"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 4a8 8 0 1 0 4.21 14.804 1 1 0 0 1 1.054 1.7A9.96 9.96 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.104-.27 2.31-.949 3.243-.716.984-1.849 1.6-3.331 1.465a4.2 4.2 0 0 1-2.93-1.585c-.94 1.21-2.388 1.94-3.985 1.715-2.53-.356-4.04-2.91-3.682-5.458s2.514-4.586 5.044-4.23c.905.127 1.68.536 2.286 1.126a1 1 0 0 1 1.964.368l-.515 3.545v.002a2.22 2.22 0 0 0 1.999 2.526c.75.068 1.212-.21 1.533-.65.358-.493.566-1.245.566-2.067a8 8 0 0 0-8-8Zm-.112 5.13c-1.195-.168-2.544.819-2.784 2.529s.784 3.03 1.98 3.198 2.543-.819 2.784-2.529-.784-3.03-1.98-3.198Z"
                      ></path>
                    </svg>
                  </div>
                  <FormControl>
                    <input
                      placeholder="enter your username"
                      {...field}
                      className="placeholder:text-muted-foreground h-10 w-full bg-secondary px-1 py-2 text-base outline-none"
                      maxLength={20}
                    />
                  </FormControl>
                </div>
                {userInput.length > 0 && (
                  <>
                    <FormDescription className="text-base">
                      Your full username will be @{userInput}
                    </FormDescription>
                    <ul className="overflow-hidden rounded-lg border-2 border-secondary p-3">
                      {findUser.data && (
                        <li className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            {findUser.data !== null ? (
                              <LucideX />
                            ) : (
                              <LucideCheck />
                            )}
                          </div>
                          This handle is already taken.
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {/^[a-zA-Z0-9_-]+$/.test(userInput) ? (
                            <LucideCheck />
                          ) : (
                            <LucideX />
                          )}
                        </div>
                        Only contains letters, numbers, and underscores.
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {userInput.length >= 3 ? (
                            <LucideCheck />
                          ) : (
                            <LucideX />
                          )}
                        </div>
                        At least 3 characters
                      </li>
                    </ul>
                  </>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={findUser.isLoading || userInput.length < 4}
            className="h-10 w-fit place-self-end rounded-lg"
          >
            Next
            {findUser.isLoading ? (
              <LoadingSpinner size={12} className="ml-2 text-white" />
            ) : null}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default SetUsername;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(context.req.headers),
  });

  if (!session) {
    return { redirect: { destination: "/auth/sign-in", permanent: false } };
  }

  if (session.user.usernameSet) {
    return { redirect: { destination: "/home", permanent: false } };
  }

  return { props: { username: session.user.username } };
}
