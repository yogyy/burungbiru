import { z } from "zod";

type CreateTweetVariant = "default" | "modal";

const Image = z
  .object({
    public_id: z.string(),
    secure_url: z.string(),
  })
  .optional();

const tweetSchema = z.object({
  text: z
    .string()
    .min(1, { message: "tweet must contain at least 1 character(s)" }),
  image: Image,
});

const replySchema = z.object({
  text: z
    .string()
    .min(1, { message: "reply must contain at least 1 character(s)" }),
  image: Image,
});

export { tweetSchema, replySchema, type CreateTweetVariant };
