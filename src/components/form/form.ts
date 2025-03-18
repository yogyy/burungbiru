import { z } from "zod";

type CreateTweetVariant = "default" | "modal";

const Image = z.object({ public_id: z.string(), secure_url: z.string() }).optional();

const tweetSchema = z.object({
  text: z.string().min(4, { message: "post must contain at least 4 character(s)" }),
  image: Image,
});

const replySchema = z.object({
  text: z.string().min(4, { message: "reply must contain at least 4 character(s)" }),
  image: Image,
});

const updateUserSchema = z.object({
  name: z.string().min(3).max(50),
  bio: z.string().max(160).optional(),
  location: z.string().max(30).optional(),
  website: z.string().max(100).optional(),
});

export { tweetSchema, replySchema, updateUserSchema, type CreateTweetVariant };
