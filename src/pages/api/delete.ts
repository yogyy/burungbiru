import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const generateSHA1 = (data: string) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
  };

  const generateSignature = (publicId: string, apiSecret: string) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  };

  const publicId = await req.body.publicId;
  const timestamp = new Date().getTime();
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || "";
  const signature = generateSHA1(generateSignature(publicId, apiSecret));

  const { data } = await axios.post(
    `https:api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      public_id: publicId,
      signature: signature,
      api_key: apiKey,
      timestamp: timestamp,
    }
  );

  return res.status(200).json(data);
}
