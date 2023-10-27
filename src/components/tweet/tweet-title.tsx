import Link from "next/link";
import React from "react";
import { ToolTip } from "../tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { BsThreeDots } from "react-icons/bs";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import type { UserResource } from "@clerk/types";
import { toast } from "react-hot-toast";
import { TweetType } from "./tweet-detail";

type TweetTitleType = TweetType & {
  user: UserResource | null | undefined;
};

const TweetTitle: React.FC<TweetTitleType> = (props) => {
  const { author, post, user } = props;
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

  return (
    <div className="-mt-0.5 flex h-5 w-full flex-wrap items-start">
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
        <time dateTime={post.createdAt.toISOString()}>{`${dayjs(
          post.createdAt
        ).format("DD MMM")}`}</time>
        <ToolTip tip={dayjs(post.createdAt).format("LT LL")} />
      </Link>

      {user?.id === author.id ? (
        <Popover>
          <PopoverTrigger
            onClick={(e) => e.stopPropagation()}
            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full p-1 hover:bg-primary/25"
          >
            <BsThreeDots className="text-base" />
          </PopoverTrigger>
          <PopoverContent>
            <button
              onClick={
                user?.id === author.id
                  ? deletePost
                  : () => console.log("bukan author")
              }
            >
              delete
            </button>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
};

export { TweetTitle, type TweetTitleType };
