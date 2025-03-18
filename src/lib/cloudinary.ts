import axios from "axios";
import { toast } from "sonner";

interface Cloudinary {
  access_mode: string;
  asset_id: string;
  batchId: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  id: string;
  original_filename: string;
  path: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  thumbnail_url: string;
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}

const cloudinaryUpload = async (file: File): Promise<Cloudinary | undefined> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(`/api/cloudinary/upload`, formData);

  return await data;
};

const cloudinaryDestroy = async (id: string) => {
  const { data } = await axios.post("/api/cloudinary/delete", {
    publicId: id,
  });

  return data;
};

const imagePost = (image: string | File) => {
  const data = cloudinaryUpload(image as File);
  toast.promise(data, {
    position: "top-right",
    loading: "upload your image...",
    success: "upload image success",
    error: "Uh oh, uploading image went error!",
  });

  return data;
};

export { imagePost, cloudinaryDestroy };
