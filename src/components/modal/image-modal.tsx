import Image, { ImageProps } from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

export const ImageModal = ({ src, alt, className, ...props }: ImageProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={src || ""}
          alt={alt || ""}
          className={cn("cursor-pointer object-cover", className)}
          {...props}
        />
      </DialogTrigger>
      <DialogOverlay className="bg-background/80 duration-75" />
      <DialogContent
        close
        className="h-full w-screen min-w-fit max-w-max items-center overflow-hidden rounded-md border-none border-transparent bg-transparent shadow-none outline-none md:h-auto [&>button]:bg-background"
        overlayClassName="bg-background/80"
      >
        <Image
          src={src || ""}
          width="600"
          height="400"
          alt={alt!}
          className="max-h-[85vh] w-full rounded-md bg-transparent bg-center object-contain p-0 xs:min-w-[382.5px]"
        />
      </DialogContent>
    </Dialog>
  );
};
