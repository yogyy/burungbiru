import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/server/db";
import { formatUsername } from "./utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    additionalFields: {
      username: { type: "string", required: true },
      usernameSet: { type: "boolean", required: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const newUsername = formatUsername(user.name.replace(/\s/g, ""));
          return { data: { ...user, username: newUsername } };
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
