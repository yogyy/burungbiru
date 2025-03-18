import { useState } from "react";
import { toast } from "sonner";

export function useUploadImage() {
  const [image, setImage] = useState<File | string>("");
  const [ImagePrev, setImagePrev] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ?? [];
    if (!files) return;
    const file = files[0];
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (!file) return;

    if (file.size > maxSizeInBytes)
      return toast.error(`Maximum Size Image 2MB`, {
        position: "top-center",
        style: { backgroundColor: "hsl(var(--desctructive))" },
      });
    setImage(file);
    setImagePrev(URL.createObjectURL(file));
  };

  return { image, ImagePrev, setImagePrev, handleImageChange };
}
