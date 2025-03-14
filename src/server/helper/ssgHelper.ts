import { prisma } from "~/server/db";
import superjson from "superjson";
import { appRouter } from "../api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: undefined, user: undefined },
    transformer: superjson,
  });
