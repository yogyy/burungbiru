import { z } from "zod";

const tweetSchema = z.object({
  content: z
    .string()
    .min(1, { message: "content must contain at least 1 character(s)" })
    .max(255, {
      message: "content must contain at most 255 character(s)",
    }),
  image: z
    .object({
      secure_url: z.string(),
      public_id: z.string(),
    })
    .optional(),
  type: z.enum(["POST", "REPOST", "COMMENT"]),
  // .refine(
  //   (schema) => schema.content.length > 0 || schema.image !== undefined
  // )
});

export { tweetSchema };
