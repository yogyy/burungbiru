import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button, ButtonProps } from "../ui/button";
import CreateTweet from "../form/tweet-form";
import { useTweetModal } from "~/hooks/store";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { Tweet } from "../icons";
import { cn } from "~/lib/utils";
import { useMediaQuery } from "~/hooks/use-media-q";

export const CreatePostModal: React.FC<ButtonProps> = ({
  className,
  ...props
}) => {
  const { show, setShow } = useTweetModal();
  const matches = useMediaQuery("(min-width: 570px)");

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button
          type="button"
          variant="default"
          className={cn(
            "h-[50px] w-[50px] rounded-full p-0 font-semibold xl:min-h-[52px] xl:w-full xl:min-w-[52px]",
            className
          )}
          {...props}
        >
          <Tweet size={24} className="block fill-foreground xl:hidden" />
          <span className="hidden text-[17px] xl:block">Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "hide-scrollbar top-0 h-screen translate-y-0 items-start overflow-hidden overflow-y-scroll rounded-none border-none p-0 text-start [&>button]:block",
          "max-w-[600px] min-[570px]:top-[5%] min-[570px]:h-auto min-[570px]:max-h-[90vh] min-[570px]:!rounded-2xl",
          matches
            ? ""
            : "data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]"
        )}
      >
        <DialogHeader className="relative flex flex-col-reverse space-y-0">
          <CreateTweet className="" variant="modal" />
          <DialogDescription asChild>
            <div className="sticky top-0 flex h-[53px] w-full items-center justify-between bg-background/10 px-4 backdrop-blur-sm">
              <button
                onClick={() => setShow((prev) => !prev)}
                className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full focus-within:bg-[rgba(239,243,244,0.1)] hover:bg-[rgba(239,243,244,0.1)]"
              >
                <IoArrowBack size={26} className="block sm:hidden" />
                <IoClose size={26} className="hidden sm:block" />
                <span className="sr-only">back</span>
              </button>
              <DialogTitle className="mr-[76px] text-xl font-semibold leading-6 sm:mr-0">
                <Button
                  variant="ghost"
                  className="text-primary hover:bg-primary/10"
                >
                  Draft
                </Button>
              </DialogTitle>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
