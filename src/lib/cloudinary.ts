import axios from "axios";
import { FileUploadInfo } from "~/types";

const cloudinarUpload = async (
  file: File
): Promise<FileUploadInfo["info"] | undefined> => {
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

export { cloudinarUpload, cloudinaryDestroy };
