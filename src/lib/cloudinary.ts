import axios from "axios";
import { toast } from "sonner";
import { FileUploadInfo } from "~/types";

const cloudinaryUpload = async (file: File): Promise<FileUploadInfo["info"] | undefined> => {
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
