import { MouseEventHandler } from "react";
import { LuX } from "react-icons/lu";
import { ImageModal } from "../modal";
import { Button } from "../ui/button";

interface ImagePreviewProps {
  image: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const ImagePreview = ({ image, onClick }: ImagePreviewProps) => {
  return (
    <div className="relative pb-2">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1 rounded-full bg-background p-1 opacity-70 transition-opacity hover:bg-background hover:opacity-100"
        onClick={onClick}
      >
        <LuX size={20} />
        <span className="sr-only">close preview image</span>
      </Button>
      <ImageModal
        width="600"
        height="400"
        src={image}
        className="max-h-[42.5rem] w-full rounded-2xl"
        alt="image preview"
      />
    </div>
  );
};
