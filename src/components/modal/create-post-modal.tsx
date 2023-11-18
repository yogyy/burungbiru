import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { CreateTweet } from "../form";
import { useTweetModal } from "~/hooks/store";
import { IoArrowBack, IoClose } from "react-icons/io5";

export const CreatePostModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { show, setShow } = useTweetModal();

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="create-post-content top-0 h-screen max-w-[600px] translate-y-0 items-start overflow-hidden overflow-y-scroll rounded-none border-none p-0 text-start base:top-[5%] base:h-auto base:max-h-[90vh] base:!rounded-2xl [&>button]:block">
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
