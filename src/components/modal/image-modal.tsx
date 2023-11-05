// /* eslint-disable @next/next/no-img-element */
import Image, { ImageProps } from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

export const ImageModal: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Image
          src={src as string}
          alt={alt as string}
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
        className="h-full w-screen min-w-fit max-w-max items-center overflow-hidden rounded-md border-none border-transparent bg-transparent shadow-none outline-none md:h-auto [&>button]:bg-background"
      >
        <Image
          src={src!}
          alt={alt!}
          className="max-h-screen w-full rounded-md bg-background/60 bg-center object-contain p-0 xs:min-w-[382.5px]"
        />
      </DialogContent>
    </Dialog>
  );
};
