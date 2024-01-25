import { z } from "zod";

type CreateTweetVariant = "default" | "modal";

const tweetSchema = z.object({
  text: z
    .string()
    .min(1, { message: "tweet must contain at least 1 character(s)" }),
  image: z
    .object({
      public_id: z.string(),
      secure_url: z.string(),
    })
    .optional(),
});

export { tweetSchema, type CreateTweetVariant };
