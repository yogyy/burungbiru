import { env } from "~/env.mjs";
import axios, { AxiosError } from "axios";
import { PathLike, promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { Fields, Files, IncomingForm } from "formidable";

export const config = { api: { bodyParser: false } };

const parseFormData = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const fData = await parseFormData(req);
  const imageFile = fData.files.file;
  const tempImagePath = imageFile?.find((i) => i.filepath);
  const image = await fs.readFile(tempImagePath?.filepath as PathLike);

  try {
    const formData = new FormData();
    const blob = new Blob([image], { type: "application/octet-stream" });
    formData.append("file", blob);
    formData.append("upload_preset", env.CLOUDINARY_CLOUD_PRESET);

    const { data, status } = await axios.post<{ result: string }>(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    res.status(status).json(data);
  } catch (err) {
    const error = err as AxiosError;
    res.status(500).json({ error: error.message });
  } finally {
    fs.rm(tempImagePath?.filepath as PathLike);
  }
}
