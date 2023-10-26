import Image from "next/image";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { ToolTip } from "./tooltip";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { BsThreeDots } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "~/lib/utils";
dayjs.extend(LocalizedFormat);

type PostWithUser = RouterOutputs["posts"]["getAll"][number] &
  React.HTMLAttributes<HTMLDivElement>;

export const PostView: React.FC<PostWithUser> = ({
  post,
  author,
  className,
  ...props
}) => {
  const { user } = useUser();

  const ctx = api.useUtils();
  const { mutate, isLoading: isPosting } = api.posts.deleteById.useMutation({
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
    <div
      tabIndex={0}
      key={post.id}
      className={cn(
        "w-full max-w-[600px] border-b border-border px-4 outline-none transition-colors duration-200 ease-in-out",
        className
      )}
      {...props}
    >
      <div className="relative flex w-full py-3">
        <div className="mr-3 h-auto w-12 flex-shrink-0">
          <Image
            width={40}
            height={40}
            draggable={false}
            src={author.profileImg}
            alt={`@${author.username || author.lastName}'s profile picture`}
            className="first-letter flex basis-12 rounded-full"
          />
        </div>
        <div className="w-full flex-col">
          <div className="flex w-full flex-wrap items-center font-bold">
            <Link
              onClick={(e) => e.stopPropagation()}
              className="break-words text-foreground hover:underline"
              href={`/@${
                author.username
                  ? author.username
                  : `${author.firstName}-${author.lastName}`
              }`}
            >
              {`${author.firstName} ${
                author.lastName !== null ? author.lastName : ""
              }`}
            </Link>
            <Link
              onClick={(e) => e.stopPropagation()}
              className="ml-2 truncate font-thin text-accent outline-none"
              href={`/@${author.username}`}
            >
              <span>{`@${author.username}`}</span>
            </Link>
            <span className="px-1">·</span>
            <Link
              href={`/post/${post.id}`}
              className="group relative w-max text-sm font-thin text-accent hover:underline"
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
                  className="z-[22] ml-auto block items-center justify-center rounded-full p-1 hover:bg-primary/25"
                >
                  <BsThreeDots />
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
          <div className="flex w-fit justify-start">
            <p className="whitespace-pre-line break-words text-[16px]">
              {post.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
