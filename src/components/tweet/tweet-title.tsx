import Link from "next/link";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { BsThreeDots } from "react-icons/bs";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import type { UserResource } from "@clerk/types";
import { toast } from "react-hot-toast";
import { TweetType } from "./tweet-post";
import { BiSolidTrash } from "react-icons/bi";
import { cn } from "~/lib/utils";
import { tweetTime } from "~/lib/tweet";

type TweetTitleType = TweetType & {
  user: UserResource | null | undefined;
};

const TweetTitle: React.FC<TweetTitleType> = (props) => {
  const { author, post, user, variant } = props;
  const ctx = api.useUtils();

  const { mutate, isLoading: isDeleting } = api.posts.deleteById.useMutation({
    onSuccess: () => {
      ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  const deletePost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    mutate({ id: post.id });
  };

  const currentTime = dayjs();

  return (
    <div className="flex w-full flex-wrap items-start justify-between">
      <div className={cn("flex", variant === "details" && "flex-col")}>
        <Link
          onClick={(e) => e.stopPropagation()}
          className="-mt-0.5 flex items-start break-words font-sans text-base font-bold outline-none focus-within:underline hover:underline"
          href={`/@${author.username}`}
        >
          {`${author.firstName} ${
            author.lastName !== null ? author.lastName : ""
          }`}
        </Link>
        <Link
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="ml-2 inline-flex text-accent outline-none"
          href={`/@${author.username}`}
        >
          {`@${author.username}`}
        </Link>
        <span className="px-1">·</span>
        <Link
          href={`/post/${post.id}`}
          className="group relative flex w-max items-end text-sm font-thin text-accent outline-none hover:underline focus:underline"
          aria-label={dayjs(post.createdAt).format("LL LT")}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <time dateTime={post.createdAt.toISOString()}>
                  {tweetTime(post.createdAt)}
                </time>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="rounded-none border-none bg-[#495A69] p-1 font-sans text-xs text-white"
              >
                {dayjs(post.createdAt).format("LT LL")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      </div>

      {user?.id === author.id ? (
        <div className="">
          <Popover>
            <PopoverTrigger
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full p-1 hover:bg-primary/25"
            >
              <BsThreeDots className="text-base" />
            </PopoverTrigger>
            <PopoverContent
              onClick={(e) => e.stopPropagation()}
              side="left"
              sideOffset={-30}
              align="start"
            >
              <AlertDialog>
                <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
                  <BiSolidTrash /> Hapus
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus postingan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ini tidak dapat dibatalkan dan akan dihapus dari profil
                      Anda, timeline akun yang mengikuti Anda, dan dari hasil
                      pencarian.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      className="bg-red-600"
                      onClick={
                        user?.id === author.id
                          ? deletePost
                          : () => console.log("bukan author")
                      }
                    >
                      Hapus
                    </AlertDialogAction>
                    <AlertDialogCancel>Batalkan</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              ;
            </PopoverContent>
          </Popover>
        </div>
      ) : null}
    </div>
  );
};

export { TweetTitle, type TweetTitleType };
