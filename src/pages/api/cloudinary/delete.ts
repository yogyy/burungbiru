import crypto from "crypto";
import { env } from "~/env.mjs";
import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const publicId = await req.body.publicId;
  const timestamp = new Date().getTime();
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  const generateSHA1 = (data: string) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
  };

  const generateSignature = (publicId: string, apiSecret: string) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  };

  const signature = generateSHA1(generateSignature(publicId, apiSecret));

  try {
    const { data } = await axios.post(
      `https:api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      }
    );

    return res.status(200).json(data);
  } catch (err) {
    const error = err as AxiosError;
    res.status(500).json({ error: error.message });
  }
}
