import axios from "axios";
import { toast } from "react-hot-toast";
import { FileUploadInfo } from "~/types";

const cloudinaryUpload = async (
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

const imagePost = (image: string | File) => {
  return toast.promise(
    cloudinaryUpload(image as File),
    {
      loading: "upload your image...",
      success: "upload image success",
      error: "Uh oh, uploading image went error!",
    },
    { position: "top-right" }
  );
};

export { imagePost, cloudinaryDestroy };
