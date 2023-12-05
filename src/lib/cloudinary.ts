import axios from "axios";
import { FileUploadInfo } from "~/types";

export const uploadImage = async (
  file: File
): Promise<FileUploadInfo["info"] | undefined> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET || ""
  );

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  return await data;
};
