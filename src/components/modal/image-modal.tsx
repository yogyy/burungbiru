import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

export const ImageModal: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = ({ src, alt, className, ...props }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={cn("cursor-pointer object-cover", className)}
          {...props}
        />
      </DialogTrigger>
      <DialogOverlay
        className="bg-background/80 duration-75"
        onClick={() => setShowModal((prev) => !prev)}
      />
      <DialogContent
        close
        className="h-full w-screen min-w-fit max-w-max items-center overflow-hidden rounded-md border-none border-transparent p-0 shadow-none outline-none md:h-auto [&>button]:bg-background"
      >
        <img
          src={src}
          alt={alt}
          width={600}
          className="max-h-screen w-full cursor-zoom-in rounded-md bg-center object-contain xs:min-w-[382.5px]"
        />
      </DialogContent>
    </Dialog>
  );
};
