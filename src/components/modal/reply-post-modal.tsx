import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button, ButtonProps } from "../ui/button";
import { useReplyModal, useTweetModal } from "~/hooks/store";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { CommentIcon, TweetIcon } from "../icons";
import { cn } from "~/lib/utils";
import dynamic from "next/dynamic";
import { TweetPost, TweetProps } from "../tweet";
import CreateReply from "../form/reply-form";

const LazyForm = dynamic(() => import("~/components/form"));

type ReplyProps = ButtonProps & TweetProps;

export const ReplyPostModal: React.FC<ReplyProps> = ({
  className,
  children,
  author,
  post,
  repostAuthor,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <Dialog open={show} onOpenChange={setShow} key={post.id}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button
          variant="ghost"
          type="button"
          size="icon"
          className={cn(
            "group/button z-10 -mr-2 flex border-2 transition-all ease-in last:mr-0",
            "hover:bg-primary/10 focus-visible:border-primary/50 focus-visible:bg-primary/10 group-hover:bg-primary/10"
          )}
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "hide-scrollbar top-0 h-screen translate-y-0 items-start overflow-hidden overflow-y-scroll rounded-none border-none p-0 text-start [&>button]:block",
          "max-w-[600px] min-[570px]:top-[5%] min-[570px]:h-auto min-[570px]:max-h-[90vh] min-[570px]:!rounded-2xl",
          "max-[570px]:data-[state=open]:!slide-in-from-bottom-[48%]"
        )}
      >
        <DialogHeader className="relative flex flex-col space-y-0">
          <DialogDescription asChild>
            <div className="sticky top-0 flex h-[53px] w-full items-center justify-between px-4 backdrop-blur-sm">
              <button
                onClick={() => setShow((prev) => !prev)}
                className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full focus-within:bg-[rgba(239,243,244,0.1)] hover:bg-[rgba(239,243,244,0.1)]"
              >
                <IoArrowBack size={26} className="block sm:hidden" />
                <IoClose size={26} className="hidden sm:block" />
                <span className="sr-only">back</span>
              </button>
              <DialogTitle className="mr-[76px] text-xl font-semibold leading-6 min-[570px]:mr-0">
                <Button
                  variant="ghost"
                  className="text-primary hover:bg-primary/10"
                >
                  Draft
                </Button>
              </DialogTitle>
            </div>
          </DialogDescription>
          <div className="">
            <TweetPost
              author={author}
              post={post}
              repostAuthor={repostAuthor}
              variant="parent"
              className="border-none"
            />
          </div>
          <CreateReply
            post={post}
            variant="modal"
            setShowReplyModal={setShow}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
